import routes from "../routes";

export default async function modules(app: any): Promise<void> { 
  
    app.use(routes)
}