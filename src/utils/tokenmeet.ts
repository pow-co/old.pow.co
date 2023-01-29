
import axios from 'axios'

const question = 'bcbeb659562d1a4a97d40705d74d261eabdbff9c4dd8bcf463421656a8215eb7'

export async function determinePowcoMeetingTokenRequirement(): Promise<number> {

  console.log('tokenmeet.powco.tokenrequirement.determine')

  try {

    const { data } = await axios.get(`https://askbitcoin.ai/api/v1/questions/${question}`)

    const amount = data.question.answers.map((answer: any) => {

      var value;

      const difficulty = answer.boostpow_proofs.reduce((acc: number, proof: any) => {     
          
          return acc + parseFloat(proof.difficulty)
  
      }, 0)

      try {

        value = parseInt(answer.content)

      } catch(error) {

        return null
      }

      return { value, difficulty }

    })
    .filter(({ value, difficulty}: { value: number, difficulty: number}) => {
      return value !== null && !isNaN(value) && !isNaN(difficulty)
    })
    .sort((a: any, b: any) => b.difficulty - a.difficulty)[0]

    console.log('tokenmeet.powco.tokenrequirement.determine.result', { amount })

    return amount

  } catch(error) {
    
    console.error('tokenmeet.powco.tokenrequirement.determine.error', error)

    return 10000;

  }

}
