

async function auth(email: string, password: string) {
    const requestData = {
        device: {
            so: 'Windows 11',
            platform: 'Desktop',
            browser: {
                name: 'Chrome',
                version: '98.0.4758.102',
            },
        },
        user: {
            email: email,
            password: password,
        },
    };

    try {
        const response = await fetch('http://frontend-test-prd.eba-tspuvqix.sa-east-1.elasticbeanstalk.com/v1/auth/login', {
            method: 'POST',
            headers: {
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,DELETE,PATCH,POST,PUT",
                'Access-Control-Allow-Headers': "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
                'Content-Type': 'application/json',
                'x-api-key': '064c8625-ef57-4595-98c5-a7efeeb7459c',
                'Accept-Language': 'pt-BR',
            },
            body: JSON.stringify(requestData),
        });

        return response;

    } catch (error) {
        // Handle erro de rede
        console.error('Erro de rede:', error);
        return null;
    }
}

export default auth;

export async function create(jwt: string, name: string, email: string, photoUrl: string) {
    //name: string, email: string, photoUrl: string
    const requestData = {

        name: name,
        email: email,
        photoUrl: photoUrl

        };

    try {


        const response = await fetch('http://frontend-test-prd.eba-tspuvqix.sa-east-1.elasticbeanstalk.com/v1/clients', {
            method: 'POST',
            headers: {
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,DELETE,PATCH,POST,PUT",
                'Access-Control-Allow-Headers': "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
                'Content-Type': 'application/json',
                'x-api-key': '064c8625-ef57-4595-98c5-a7efeeb7459c',
                'Accept-Language': 'pt-BR',
                'Authorization': 'Bearer ' + jwt,
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            throw { message: errorMessage.message, status: response.status };
            
            // Se a resposta não estiver OK, lançamos o erro com a resposta HTTP
                    }

        // Se a resposta estiver OK, retornamos os dados da resposta
        return response.json();
    } catch (error) {
        // Handle erro de rede
        console.error('Erro de rede:', error);
        throw error;

    }
}

export async function lists(jwt: string,offset: string) {
    

    try {


        const response = await fetch('http://frontend-test-prd.eba-tspuvqix.sa-east-1.elasticbeanstalk.com/v1/clients?offset='+offset+'&limit=10', {
            method: 'GET',
            headers: {
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,DELETE,PATCH,POST,PUT",
                'Access-Control-Allow-Headers': "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
                'Content-Type': 'application/json',
                'x-api-key': '064c8625-ef57-4595-98c5-a7efeeb7459c',
                'Accept-Language': 'pt-BR',
                'Authorization': 'Bearer ' + jwt,
            },
        });

        
        if (!response.ok) {
            // Se a resposta não estiver OK, lançamos o erro com a resposta HTTP
            throw response;
        }

        // Se a resposta estiver OK, retornamos os dados da resposta
        return response.json();
    } catch (error) {
        // Handle erro de rede
        console.error('Erro de rede:', error);
        throw error;


    }
}

export async function update(jwt: string,idclient: string,name: string, email: string,photoUrl: string) {
   
    try {
        const url = `http://frontend-test-prd.eba-tspuvqix.sa-east-1.elasticbeanstalk.com/v1/clients/${idclient}`;
        const requestOptions: RequestInit = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': '064c8625-ef57-4595-98c5-a7efeeb7459c',
                'Accept-Language': 'pt-BR',
                'Authorization': 'Bearer ' + jwt,
            },
        };

        if (name !== undefined || email !== undefined || photoUrl !== undefined) {
            // Se pelo menos um dos campos de dados for fornecido, adicionamos o corpo da solicitação
            const body = JSON.stringify({ name, email, photoUrl });
            requestOptions.body = body;
        }

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            // Se a resposta não estiver OK, lançamos o erro com a resposta HTTP
            throw response;
        }

        // Se a resposta estiver OK, retornamos os dados da resposta
        return response.json();
    } catch (error) {
        // Handle erro de rede ou outros erros
        console.error('Erro:', error);
        throw error;
    }
}

export async function delclient(jwt: string,idclient: string) {
   
    try {
        const url = `http://frontend-test-prd.eba-tspuvqix.sa-east-1.elasticbeanstalk.com/v1/clients/` + idclient;
        const requestOptions: RequestInit = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': '064c8625-ef57-4595-98c5-a7efeeb7459c',
                'Accept-Language': 'pt-BR',
                'Authorization': jwt,
            },
        };

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            // Se a resposta não estiver OK, lançamos o erro com a resposta HTTP
            throw response;
        }

        // Se a resposta estiver OK, retornamos os dados da resposta
        return response.json();
    } catch (error) {
        // Handle erro de rede ou outros erros
        console.error('Erro:', error);
        throw error;
    }
}


