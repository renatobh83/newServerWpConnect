import Prometheus from "prom-client";
import type { Request, Response } from "express";
import { parse, parseISO } from "date-fns";

const register = new Prometheus.Registry();

register.setDefaultLabels({
	app: "wppconnect-server",
});

Prometheus.collectDefaultMetrics({ register });

// Função para formatar valores em bytes para MB, GB, etc.
function formatValue(value: number, metricName: string): string {
	if (metricName === "process_start_time_seconds") {
		// Converter timestamp UNIX para data legível
		const date = new Date(value * 1000);
		return date;
	}
	if (value >= 1e9) {
		return `${(value / 1e9).toFixed(2)} GB`;
	}
	if (value >= 1e6) {
		return `${(value / 1e6).toFixed(2)} MB`;
	}
	if (value >= 1e3) {
		return `${(value / 1e3).toFixed(2)} KB`;
	}

	return `${value} B`;
}

export async function metricsHtml(req: Request, res: Response) {
	const metrics = await register.getMetricsAsJSON();

	const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Métricas do Servidor</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f9f9f9; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 10px; border: 1px solid #ccc; text-align: left; }
        th { background-color: #f0f0f0; }
        .help { font-style: italic; color: #555; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <h1>Métricas do Servidor - wppconnect-server</h1>
      ${metrics
				.map(
					(metric) => `
        <h2>${metric.name}</h2>
        <p class="help">${metric.help}</p>
        <table>
          <tr>
            <th>Rótulos</th>
            <th>Valor</th>
          </tr>
          ${metric.values
						.map(
							(value) => `
            <tr>
              <td>${Object.keys(value.labels).length > 0 ? JSON.stringify(value.labels) : "Nenhum rótulo"}</td>
              <td>${formatValue(value.value, metric.name)}</td>
            </tr>
          `,
						)
						.join("")}
        </table>
      `,
				)
				.join("")}
    </body>
    </html>
  `;

	res.setHeader("Content-Type", "text/html");
	res.status(200).send(html);
}

export const prometheusRegister = register;
