import { Button, Card, CardContent, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createAPIEndpoint, ENDPOINTS } from '../api'
import useForm from '../hooks/useForm'
import useStateContext from '../hooks/useStateContext'
import Center from './Center'


const getFreshModel = () => ({
    name: '',
    email: '',
});

const Login = () => {

    const { context, setContext, resetContext } = useStateContext();
    const navigate = useNavigate();

    const {
        values,
        // setValues,
        errors,
        setErrors,
        handleInputChange
    } = useForm(getFreshModel);

    useEffect(() => {
        resetContext()
    }, [])

    const login = e => {
        e.preventDefault();

        if (validate())
            createAPIEndpoint(ENDPOINTS.participant)
                .post(values)
                .then(res => {
                    setContext({ participantId: res.data.participantId })
                    navigate('/quiz')
                })
                .catch(err => console.log(err))

    }

    const validate = () => {
        let temp = {};
        // temp.email = (/\S+@\S+\.\S+/).test(values.eamil) ? '' : 'Email is not valid !';
        temp.name = values.name !== '' ? '' : 'This field is required !'
        setErrors(temp);

        return Object.values(temp).every(x => x === '');
    }

    return (
        <Center>
            {context.participantId}
            <Card sx={{ width: '400px' }}>
                <CardContent sx={{ textAlign: 'center ' }}>
                    <Typography variant='h3' sx={{ my: 3 }}>
                        Quiz App
                    </Typography>
                    <Box
                        sx={{
                            '&  .MuiFormControl-root': {
                                m: 1,
                                width: '90%'
                            }
                        }}>
                        <form noValidate outocomplete='off' onSubmit={login}>
                            <TextField
                                label='Email'
                                name='email'
                                value={values.email}
                                onChange={handleInputChange}
                                variant='outlined'
                                {...(errors.email && { error: true, helperText: errors.email })} />
                            <TextField
                                label='Name'
                                name='name'
                                value={values.name}
                                onChange={handleInputChange}
                                variant='outlined'
                                {...(errors.name && { error: true, helperText: errors.name })} />
                            <Button
                                type='submit'
                                variant='contained'
                                size='large'
                                sx={{ width: '90%', m: 1 }}>Submit</Button>

                        </form>
                    </Box>
                </CardContent>
            </Card>
        </Center>
    )
}

export default Login