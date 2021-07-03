const url = 'https://dataservice.accuweather.com/';

export const Get = async (controller: string) => {
    return await fetch(url + controller)
        .then(res => res.json())
        .catch(err => console.error(err))
}