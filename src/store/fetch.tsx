const url = 'https://dataservice.accuweather.com/';

export const Get = async (controller: string) => {
    return await fetch(url + controller, { mode: 'no-cors' })
        .then(res => res.json())
        .catch(err => console.error(err))
}