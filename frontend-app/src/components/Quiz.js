import { Card, CardContent, CardHeader, CardMedia, LinearProgress, List, ListItemButton, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL, createAPIEndpoint, ENDPOINTS } from '../api'
import { getFormatedTime } from '../helper'
import useStateContext from '../hooks/useStateContext'

const Quiz = () => {

    const { context, setContext } = useStateContext();

    const [qns, setQns] = useState([])
    const [qnIndex, setQnIndex] = useState(0)
    const [timeTaken, setTimeTaken] = useState(0);

    const navigate = useNavigate()
    let timer;

    const startTimer = () => {
        timer = setInterval(() => {
            setTimeTaken(perv => perv + 1)
        }, [1000])
    }

    useEffect(() => {
        setContext({
            timeTaken: 0,
            selectedOptions: []
        })
        createAPIEndpoint(ENDPOINTS.question)
            .fetch()
            .then((res) => {
                setQns(res.data)
                startTimer()
            })
            .catch(err => {
                console.log(err);
            })

        return () => { clearInterval(timer) }
    }, [])

    const updateAnswer = (qnId, optionIndex) => {
        const temp = [...context.selectedOptions]
        temp.push({
            qnId,
            selected: optionIndex
        })

        if (qnIndex < 4) {
            setContext({ selectedOptions: [...temp] })
            setQnIndex(qnIndex + 1)
        }
        else {
            setContext({ selectedOptions: [...temp], timeTaken })
            navigate('/result')
        }
    }


    return (
        qns.length !== 0
            ?
            <Card
                sx={{
                    maxWidth: 640, mx: 'auto', mt: 5,
                    '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' }
                }}>
                <CardHeader
                    title={'Question ' + (qnIndex + 1) + ' of 5'}
                    action={<Typography> {getFormatedTime(timeTaken)} </Typography>} />
                <Box>
                    <LinearProgress variant='determinate' value={(qnIndex + 1) * 100 / 5} />
                </Box>
                {qns[qnIndex].imageName != null
                    ? <CardMedia
                        component='img'
                        image={BASE_URL + 'images/' + qns[qnIndex].imageName}
                        sx={{ width: 'quto', m: '10px quto' }} />
                    :
                    null}
                <CardContent>
                    <Typography variant='h6'>
                        {qns[qnIndex].qnInWords}
                    </Typography>
                    <List>
                        {qns[qnIndex].options.map((item, index) =>
                            <ListItemButton key={index}
                                onClick={() => updateAnswer(qns[qnIndex].qnId, index)}>
                                <div>
                                    <b>{String.fromCharCode(65 + index) + ". "}</b>  {item}
                                </div>
                            </ListItemButton>
                        )}
                    </List>
                </CardContent>
            </Card>
            :
            null
    )
}

export default Quiz