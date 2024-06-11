

export async function contact(from, title, description) {

    try {

        const body = {
            from: from,
            title: title,
            description: description
        };

        var res = await fetch('https://api.tripyojan.com/contact/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        res = await res.json();

        return res;

    }
    catch(e) {
        return { message: e.message, statuscode: 400 };
    }

}