import sql from "mssql";

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER, // IP servidor
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT), // puerto, por defecto toma el puerto 1433
  options: {
    encrypt: false, // esto es opcional, por defecto es false
  },
};

export async function getConnection() {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (error) {
    console.error("Error en la consulta SQL:", error);
    throw error;
  }
}
