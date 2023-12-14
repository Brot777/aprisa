import sql from 'mssql';

const config = {
    user: 'sa',
    password: 'Aprisa2014',
    server: '192.168.2.4', // reemplaza esto con la IP de tu servidor
    database: 'y',
    port: 49264, // esto es opcional, por defecto toma el puerto 1433
    options: {
        encrypt: false // esto es opcional, por defecto es false
    }
};



export async function getConnection() {
    try {
        const pool = await sql.connect(config);
        return pool
    } catch (error) {
        console.error('Error en la consulta SQL:', error);
        throw error;
    }
}

