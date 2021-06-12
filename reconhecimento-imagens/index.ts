import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { ComputerVisionClient } from '@azure/cognitiveservices-computervision'
import { CognitiveServicesCredentials } from '@azure/ms-rest-azure-js'
import axios from 'axios'

const computerVisionKey = ''
const computerVisionEndpoint = ''
const URL_SEND_TWEET = ''

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const { imageUrl } = req.body

    const congnitiveServiceCredentials = new CognitiveServicesCredentials(computerVisionKey)
    const client = new ComputerVisionClient(congnitiveServiceCredentials, computerVisionEndpoint)

    const options = {
        maxCandidates: 5,
        language: 'pt'
    } as any

    client.describeImage(imageUrl, options)
        .then((result) => {
            if (result.captions) {
                result.captions.forEach(({ text }) => {
                    axios.post(URL_SEND_TWEET, {
                        tweet: `Acabei de ver uma imagem de ${text}`
                    })
                })
            }

        }).catch(err => {
            console.log(err)
        })
};

export default httpTrigger;
