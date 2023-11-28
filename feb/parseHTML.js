
import cheerio  from 'cheerio';

export const getPlayerData = html => {
  let player = {}
  const $ = cheerio.load(html)

  const namePlayer = $('.box-jugador .jugador .nombre').text().trim()

  if (namePlayer !== '') {
    player.name = namePlayer
  }

  $('.box-jugador .info .nodo').each((index, element) => {
      const label = $(element).find('.label').text().trim()
      const value = $(element).find('.string').text().trim()

      // Mapear las etiquetas y valores que te interesan
      if (value !== '') {
        if (label === 'Puesto') { 
          player.position = value
        } else if (label === 'Altura') {
          if (value !== 'cm') {
            player.height = parseInt(value.replace(" cm",""))/100
          }
        } else if (label === 'Fecha Nacimiento') {
          const aux = value.split(" ")
          player.born = convertDate(aux[0])
        } else if (label === 'Nacionalidad') {
          player.nationality = value
        }
      }
  });
  return player
}

function convertDate(input) {
  const parts = input.split('/');
  if (parts.length !== 3) {
    return 'Format error';
  }

  const day = parts[0];
  const month = parts[1];
  const year = parts[2];

  const newDate = `${year}-${month}-${day}`;

  return newDate;
}