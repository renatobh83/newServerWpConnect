import { Sequelize, Op } from "sequelize";
import Confirmacao from "../../../models/Confirmacao";


interface Data {
  idExterno: string,
  tenantId: number | string;
  data?: any;
  channel: string;
  contatoSend: string;
}

const FindOrCreateConfirmacao = async ({
  tenantId,
  data,
  channel,
  contatoSend,
  idExterno
}: Data): Promise<Confirmacao | any> => {

  const horarioMaisCedo = data.dados_agendamentos.reduce(
    (min, agendamento) => {
      return agendamento.Hora < min.Hora ? agendamento : min;
    },
    data.dados_agendamentos[0]
  );

  let confirmacaoReturn: any = {};

  const confirmacao = await Confirmacao.findOne({
    where: {
      contatoSend,
      atendimentoData: data.atendimento_data,
      answered: false,
      closedAt: null,
      [Op.and]: [
        Sequelize.where(
          Sequelize.literal(`"idexterno"`),
          "@>",
          JSON.stringify([idExterno])
        ),
      ],
    }
  });


  if (confirmacao) {
    for (const agendamento of data.dados_agendamentos) {
      const { idExterno, Procedimento } = agendamento;
      await Confirmacao.update(
        {
          procedimentos: Sequelize.literal(`
            CASE
              WHEN NOT EXISTS (
                SELECT 1
                FROM jsonb_array_elements_text(procedimentos) AS elem
                WHERE elem::int = ANY(ARRAY[${Procedimento}]::int[])
              )
              THEN procedimentos || '${Procedimento}'
              ELSE procedimentos
            END
          `),
          atendimentoHora: Sequelize.fn(
            "LEAST",
            Sequelize.col("atendimentoHora"),
            horarioMaisCedo.Hora
          ),
          idexterno: Sequelize.literal(`
            CASE
              WHEN NOT EXISTS (
                SELECT 1
                FROM jsonb_array_elements_text(idexterno) AS elem
                WHERE elem::int = ANY(ARRAY[${idExterno}]::int[])
              )
              THEN idexterno || '${JSON.stringify(idExterno)}'
              ELSE idexterno
            END
          `),
        },
        {
          where: {
            id: confirmacao.id,
          },
        }
      );
    }
    return { confirmacaoJaEnviada: true };
  }

  const novosProcedimentos = [];
  const novosIdExternos = [];

  for (const agendamento of data.dados_agendamentos) {
    const { idExterno, Procedimento } = agendamento;

    // Verifique se idExterno já existe em novosIdExternos antes de adicionar
    if (!novosIdExternos.includes(idExterno)) {
      novosIdExternos.push(idExterno);
    }

    // Verifique se Procedimento já existe em novosProcedimentos antes de adicionar
    if (!novosProcedimentos.includes(Procedimento)) {
      novosProcedimentos.push(Procedimento);
    }
  }

  const confirmacaoObj: any = {
    contatoSend,
    procedimentos: novosProcedimentos,
    idexterno: novosIdExternos,
    atendimentoData: data.atendimento_data,
    atendimentoHora: horarioMaisCedo.Hora,
    tenantId: tenantId,
    channel,
  };

  confirmacaoReturn = await Confirmacao.create(confirmacaoObj);

  return confirmacaoReturn.dataValues;
};

export default FindOrCreateConfirmacao;
