import { createConnection, getConnectionOptions } from 'typeorm';

interface IOptions {
  host: string;
  database: any;
}

getConnectionOptions().then(options => {
  const newOptions = options as IOptions;
  newOptions.host = process.env.NODE_ENV === "test" ? "localhost" : "database"; //Essa opção deverá ser EXATAMENTE o nome dado ao service do banco de dados
  newOptions.database = process.env.NODE_ENV === "test" ? "fin_api_test": options.database;
  createConnection({
    ...options,
  });
});
