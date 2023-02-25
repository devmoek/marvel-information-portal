
class MarvelService {
    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json()
    }

    getAllCharacters = () => {
        return this.getResource("https://gateway.marvel.com:443/v1/public/characters?apikey=adc6f74b3e38f537e9917aeffa1b2a90");
    }
}

export default MarvelService;