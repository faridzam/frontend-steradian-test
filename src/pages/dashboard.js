import Image from 'next/image'
import { Inter } from 'next/font/google'
import Link from "next/link";
import React, { useEffect, useState } from 'react';
import Router from "next/router";

//import axios
import axios from "axios";

//import js cookie
import Cookies from 'js-cookie';

// mui component
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import {Box, Typography, Button, Dialog, AppBar, Toolbar, IconButton, TextField, Slide, Rating, InputLabel, Select, MenuItem, FormControl, Paper, DialogTitle, DialogContent, DialogContentText, DialogActions, Divider} from '@mui/material';
import {Close, Star, Edit, Delete} from '@mui/icons-material';

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import {} from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/scrollbar";

// date time adapter
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';


const inter = Inter({ subsets: ['latin'] })

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const carRatingLabels = {
    0.5: 'Useless',
    1: 'Useless+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
};

function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${carRatingLabels[value]}`;
}

export default function Home() {

    const [user, setUser] = useState({});

    const getUser = () => {
        //send data to server
        const config = {
            headers: { Authorization: `Bearer ${Cookies.get('token')}` }
        };
        
        const bodyParameters = {
        //    key: "value"
        };

        axios.post(
            `${process.env.NEXT_PUBLIC_API_BACKEND}/api/auth/me`,
            bodyParameters,
            config,
        )
        .then((response) => {
            //set user state
            setUser(response.data)
            const config = {
                headers: { Authorization: `Bearer ${Cookies.get('token')}` }
            };
            
            const bodyParameters = {
                role_id: response.data.role_id,
                user_id: response.data.id
            };
            
            axios.get(
                `${process.env.NEXT_PUBLIC_API_BACKEND}/api/cars?role_id=${response.data.role_id}`,
                bodyParameters,
                config,
            )
            .then((response) => {
                //set user state
                setCars(response.data.cars.data)
            })
            .catch((error) => {
    
                //assign error to state "validation"
                console.log(error)
            })
            axios.get(
                `${process.env.NEXT_PUBLIC_API_BACKEND}/api/orders?role_id=${response.data.role_id}&user_id=${response.data.id}`,
                bodyParameters,
                config,
            )
            .then((response) => {
                //set user state
                setOrders(response.data.orders.data)
            })
            .catch((error) => {
    
                //assign error to state "validation"
                console.log(error)
            })
        })
        .catch((error) => {

            //assign error to state "validation"
            console.log(error)
            Router.push('/');
        })
    }

    const getCars = async () => {
        const config = {
            headers: { Authorization: `Bearer ${Cookies.get('token')}` }
        };
        
        const bodyParameters = {
            role_id: user.role_id
        };

        await axios.get(
            `${process.env.NEXT_PUBLIC_API_BACKEND}/api/cars?role_id=${user.role_id}`,
            bodyParameters,
            config,
        )
        .then((response) => {
            //set user state
            setCars(response.data.cars.data)
        })
        .catch((error) => {

            //assign error to state "validation"
            console.log(error)
        })
    }
    const getOrders = async () => {
        const config = {
            headers: { Authorization: `Bearer ${Cookies.get('token')}` }
        };
        
        const bodyParameters = {
            role_id: user.role_id
        };

        await axios.get(
            `${process.env.NEXT_PUBLIC_API_BACKEND}/api/orders?role_id=${user.role_id}&user_id=${user.id}`,
            bodyParameters,
            config,
        )
        .then((response) => {
            //set user state
            setOrders(response.data.orders.data)
        })
        .catch((error) => {

            //assign error to state "validation"
            console.log(error)
        })
    }

    useEffect(() => {
        //check token
        if(Cookies.get('token')) {
            //
            getUser();
        } else {
            Router.push('/');
        }
    }, [])

    // swiper page
    const [swiper, setSwiper] = React.useState(0);
    const slideTo = (index) => swiper.slideTo(index);

    // dialog create car
    const [dialogCreateCar, setDialogCreateCar] = React.useState(false);
    const handleOpenDialogCreateCar = () => {
        setDialogCreateCar(true);
    };

    const handleCloseDialogCreateCar = () => {
        setDialogCreateCar(false);
    };

    // create car form field
    const [carName, setCarName] = React.useState('');
    const [carType, setCarType] = React.useState('');
    const [carRating, setCarRating] = React.useState(0);
    const [carRatingHover, setCarRatingHover] = React.useState(-1);
    const [carFuel, setCarFuel] = React.useState('');
    const [carImage, setCarImage] = React.useState(null);
    const [createObjectURL, setCreateObjectURL] = useState(null);
    const [carHourRate, setCarHourRate] = React.useState(0);
    const [carDayRate, setCarDayRate] = React.useState(0);
    const [carMonthRate, setCarMonthRate] = React.useState(0);

    const resetCarForm = () =>{
        setCarName('');
        setCarType('');
        setCarRating(0);
        setCarRatingHover(-1);
        setCarFuel('');
        setCarImage(null);
        setCreateObjectURL(null);
        setCarHourRate(0);
        setCarDayRate(0);
        setCarMonthRate(0);
    }

    const uploadToClient = (event) => {
        if (event.target.files && event.target.files[0]) {
          const i = event.target.files[0];
    
          setCarImage(i);
          setCreateObjectURL(URL.createObjectURL(i));
        }
      };
    
    // submit
    const submitCreateCar = async (event) => {
        const config = {
            headers: { Authorization: `Bearer ${Cookies.get('token')}` }
        };
        const body = new FormData();
        body.append("role_id", user.role_id);
        body.append("name", carName);
        body.append("car_type", carType);
        body.append("rating", carRating);
        body.append("fuel", carFuel);
        body.append("image", carImage);
        body.append("hour_rate", carHourRate);
        body.append("day_rate", carDayRate);
        body.append("month_rate", carMonthRate);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/cars`, {
          method: "POST",
          body,
        }).then((response) => {
            console.log(response.status);
            if (response.status === 200) {
                handleCloseDialogCreateCar();
                resetCarForm();
                getCars();
            }
        });

    };

    // dialog edit car
    const [dialogEditCar, setDialogEditCar] = React.useState(false);
    const handleOpenDialogEditCar = (id) => {
        setSelectedCar(id);
        getEditCar(id);
        setDialogEditCar(true);
    };

    const handleCloseDialogEditCar = () => {
        setSelectedCar(0);
        setDialogEditCar(false);
    };

    // get edit car
    const getEditCar = async (id) => {
        const config = {
            headers: { Authorization: `Bearer ${Cookies.get('token')}` }
        };
        
        const bodyParameters = {
            role_id: user.role_id
        };

        await axios.get(
            `${process.env.NEXT_PUBLIC_API_BACKEND}/api/cars/${id}?role_id=${user.role_id}`,
            bodyParameters,
            config,
        )
        .then((response) => {
            //set user state
            setCarName(response.data.car.name);
            setCarType(response.data.car.car_type);
            setCarRating(response.data.car.rating);
            setCarFuel(response.data.car.fuel);
            setCarHourRate(response.data.car.hour_rate);
            setCarDayRate(response.data.car.day_rate);
            setCarMonthRate(response.data.car.month_rate);
            setCreateObjectURL( `${process.env.NEXT_PUBLIC_API_BACKEND+response.data.car.image}`)
        })
        .catch((error) => {

            //assign error to state "validation"
            console.log(error)
        })
    };

    // update car
    const submitUpdateCar = async (event) => {
        const config = {
            headers: { Authorization: `Bearer ${Cookies.get('token')}` }
        };
        const body = new FormData();
        body.append("_method", "PUT");
        body.append("role_id", user.role_id);
        body.append("name", carName);
        body.append("car_type", carType);
        body.append("rating", carRating);
        body.append("fuel", carFuel);
        body.append("image", carImage);
        body.append("hour_rate", carHourRate);
        body.append("day_rate", carDayRate);
        body.append("month_rate", carMonthRate);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/cars/${selectedCar}`, {
            method: "POST",
            body,
        }).then((response) => {
            if (response.status === 200) {
                handleCloseDialogEditCar();
                resetCarForm();
                getCars();
            }
        });

    };

    // dialog delete car
    const [dialogDeleteCar, setDialogDeleteCar] = React.useState(false);
    const handleOpenDialogDeleteCar = (id) => {
        setSelectedCar(id);
        setDialogDeleteCar(true);
    };

    const handleCloseDialogDeleteCar = () => {
        setSelectedCar(0);
        setDialogDeleteCar(false);
    };

    // delete car
    const submitDeleteCar = async (event) => {
        const config = {
            headers: { Authorization: `Bearer ${Cookies.get('token')}` }
        };
        const body = new FormData();
        body.append("_method", "DELETE");
        body.append("role_id", user.role_id);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/cars/${selectedCar}`, {
            method: "POST",
            body,
        }).then((response) => {
            if (response.status === 200) {
                handleCloseDialogDeleteCar();
                resetCarForm();
                getCars();
            }
        });

    };

    // create order form state
    const [orderCar, setOrderCar] = React.useState({});
    const [orderPickUpLoc, setOrderPickUpLoc] = React.useState('');
    const [orderDropOffLoc, setOrderDropOffLoc] = React.useState('');
    const [orderPickUpDate, setOrderPickUpDate] = React.useState();
    const [orderDropOffDate, setOrderDropOffDate] = React.useState();

    const resetOrderForm = () =>{
        setOrderCar({});
        setOrderPickUpLoc('');
        setOrderDropOffLoc('');
        setOrderPickUpDate();
        setOrderDropOffDate();
    }

    // dialog create order
    const [dialogCreateOrder, setDialogCreateOrder] = React.useState(false);
    const handleOpenDialogCreateOrder = (id) => {
        setDialogCreateOrder(true);
    };

    const handleCloseDialogCreateOrder = () => {
        setDialogCreateOrder(false);
    };

    const submitCreateOrder = async (event) => {
        const config = {
            headers: { Authorization: `Bearer ${Cookies.get('token')}` }
        };
        const body = new FormData();
        body.append("role_id", user.role_id);
        body.append("user_id", user.id);
        body.append("car_id", orderCar.id);
        body.append("pick_up_loc", orderPickUpLoc);
        body.append("drop_off_loc", orderDropOffLoc);
        body.append("pick_up_date", orderPickUpDate);
        body.append("drop_off_date", orderDropOffDate);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/orders`, {
            method: "POST",
            body,
        }).then((response) => {
            if (response.status === 200) {
                handleCloseDialogCreateOrder();
                resetOrderForm();
                getOrders();
            }
        });

    };

    // dialog edit order
    const [dialogEditOrder, setDialogEditOrder] = React.useState(false);
    const handleOpenDialogEditOrder = (id) => {
        setSelectedOrder(id);
        getEditOrder(id);
        setDialogEditOrder(true);
    };

    const handleCloseDialogEditOrder = () => {
        setSelectedOrder(0);
        setDialogEditOrder(false);
    };

    // get edit car
    const getEditOrder = async (id) => {
        const config = {
            headers: { Authorization: `Bearer ${Cookies.get('token')}` }
        };
        
        const bodyParameters = {
            role_id: user.role_id
        };

        await axios.get(
            `${process.env.NEXT_PUBLIC_API_BACKEND}/api/orders/${id}?role_id=${user.role_id}`,
            bodyParameters,
            config,
        )
        .then((response) => {
            //set user state
            let carsIndex = cars.findIndex(x => x.id === response.data.order.car.id);
            setOrderCar(cars[carsIndex]);
            setOrderPickUpLoc(response.data.order.pick_up_loc);
            setOrderDropOffLoc(response.data.order.drop_off_loc);
            setOrderPickUpDate(dayjs(response.data.order.pick_up_date));
            setOrderDropOffDate(dayjs(response.data.order.drop_off_date));
        })
        .catch((error) => {

            //assign error to state "validation"
            console.log(error)
        })
    };

    const submitUpdateOrder = async (event) => {
        const config = {
            headers: { Authorization: `Bearer ${Cookies.get('token')}` }
        };
        const body = new FormData();
        body.append("_method", "PATCH");
        body.append("role_id", user.role_id);
        body.append("user_id", user.id);
        body.append("car_id", orderCar.id);
        body.append("pick_up_loc", orderPickUpLoc);
        body.append("drop_off_loc", orderDropOffLoc);
        body.append("pick_up_date", dayjs(orderPickUpDate).valueOf());
        body.append("drop_off_date", dayjs(orderDropOffDate).valueOf());

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/orders/${selectedOrder}`, {
            method: "POST",
            body,
        }).then((response) => {
            if (response.status === 200) {
                handleCloseDialogEditOrder();
                resetOrderForm();
                getOrders();
            }
        });

    };

    // dialog delete order
    const [dialogDeleteOrder, setDialogDeleteOrder] = React.useState(false);
    const handleOpenDialogDeleteOrder = (id) => {
        setSelectedOrder(id);
        setDialogDeleteOrder(true);
    };

    const handleCloseDialogDeleteOrder = () => {
        setSelectedOrder(0);
        setDialogDeleteOrder(false);
    };

    // delete car
    const submitDeleteOrder = async (event) => {
        const config = {
            headers: { Authorization: `Bearer ${Cookies.get('token')}` }
        };
        const body = new FormData();
        body.append("_method", "DELETE");
        body.append("role_id", user.role_id);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/orders/${selectedOrder}`, {
            method: "POST",
            body,
        }).then((response) => {
            if (response.status === 200) {
                handleCloseDialogDeleteOrder();
                resetOrderForm();
                getOrders();
            }
        });

    };

    //   show cars
    const [cars, setCars] = React.useState([]);
    //   selected cars
    const [selectedCar, setSelectedCar] = React.useState(0);
    //   show cars
    const [orders, setOrders] = React.useState([]);
    //   selected cars
    const [selectedOrder, setSelectedOrder] = React.useState(0);

    return (
        <Grid
        container={true}
        direction="column"
        spacing={0}
        sx={{
            display: 'flex',
            width: '100%',
        }}>

            {/* modal Create Car */}
            <Dialog
            fullScreen
            open={dialogCreateCar}
            onClose={handleCloseDialogCreateCar}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
                <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseDialogCreateCar}
                aria-label="close"
                >
                <Close/>
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    Create Car
                </Typography>
            </Toolbar>
            </AppBar>
            {/* body */}
            <Grid
            container={true}
            direction="row"
            spacing={0}
            sx={{
                display: 'flex',
                width: '100%',
                height: '100%',
                padding: '50px',
                justifyContent: 'flex-start',
                alignItems: 'flex-start'
            }}>
                {/* car data form */}
                <Grid
                container={true}
                direction="column"
                spacing={0}
                sx={{
                    display: 'flex',
                    width: '50%',
                    height: '100%',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start'
                }}>
                    <Grid
                    container={true}
                    direction="column"
                    spacing={0}
                    sx={{
                        display: 'flex',
                        width: '100%',
                        paddingY: '10px',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end'
                    }}>
                        {/* car name */}
                        <Box
                        sx={{
                            width: '100%',
                            padding: '10px',
                        }}>
                            <TextField
                            size='small'
                            value={carName}
                            onChange={(event, newValue) => {
                                setCarName(event.target.value);
                            }}
                            autoComplete='off'
                            label="Car Name"
                            placeholder='Mobil A'
                            // InputProps={{
                            // startAdornment: (
                            //     <InputAdornment position="start">
                            //         <AccountCircle/>
                            //     </InputAdornment>
                            // ),
                            // }}
                            sx={{
                                width: '100%',
                            }}
                            variant="outlined"
                            />
                        </Box>
                        {/* car type */}
                        <Box
                        sx={{
                            width: '100%',
                            padding: '10px',
                        }}>
                            <TextField
                            size='small'
                            value={carType}
                            onChange={(event, newValue) => {
                                setCarType(event.target.value);
                            }}
                            autoComplete='off'
                            label="Car Type"
                            placeholder='Tipe A'
                            // InputProps={{
                            // startAdornment: (
                            //     <InputAdornment position="start">
                            //         <Phone/>
                            //     </InputAdornment>
                            // ),
                            // }}
                            sx={{
                                width: '100%',
                            }}
                            variant="outlined"
                            />
                        </Box>
                        {/* fuel */}
                        <Box
                        sx={{
                            width: '100%',
                            padding: '10px',
                            display : 'flex',
                            flexDirection: 'row'
                        }}>
                            <FormControl
                            sx={{
                                width: '100%'
                            }}>
                                <InputLabel id="demo-simple-select-label">Fuel Type</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                sx={{
                                    width: '100%'
                                }}
                                value={carFuel}
                                label="Fuel Type"
                                onChange={(event, newValue) => {
                                    setCarFuel(event.target.value);
                                }}
                                >
                                    <MenuItem value={'gasoline'}>Gasoline</MenuItem>
                                    <MenuItem value={'diesel fueled'}>Diesel Fueled</MenuItem>
                                    <MenuItem value={'electric'}>Electric</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        {/* car hourly Rate */}
                        <Box
                        sx={{
                            width: '100%',
                            padding: '10px',
                        }}>
                            <TextField
                            size='small'
                            value={carHourRate}
                            onChange={(event, newValue) => {
                                setCarHourRate(event.target.value);
                            }}
                            autoComplete='off'
                            label="Hourly Rate"
                            placeholder='50000'
                            type='number'
                            onFocus={event => {
                                event.target.select();
                            }}
                            // InputProps={{
                            // startAdornment: (
                            //     <InputAdornment position="start">
                            //         <AccountCircle/>
                            //     </InputAdornment>
                            // ),
                            // }}
                            sx={{
                                width: '100%',
                            }}
                            variant="outlined"
                            />
                        </Box>
                        {/* car daily Rate */}
                        <Box
                        sx={{
                            width: '100%',
                            padding: '10px',
                        }}>
                            <TextField
                            size='small'
                            value={carDayRate}
                            onChange={(event, newValue) => {
                                setCarDayRate(event.target.value);
                            }}
                            autoComplete='off'
                            label="Daily Rate"
                            placeholder='200000'
                            type='number'
                            onFocus={event => {
                                event.target.select();
                            }}
                            // InputProps={{
                            // startAdornment: (
                            //     <InputAdornment position="start">
                            //         <AccountCircle/>
                            //     </InputAdornment>
                            // ),
                            // }}
                            sx={{
                                width: '100%',
                            }}
                            variant="outlined"
                            />
                        </Box>
                        {/* car monthly Rate */}
                        <Box
                        sx={{
                            width: '100%',
                            padding: '10px',
                        }}>
                            <TextField
                            size='small'
                            value={carMonthRate}
                            onChange={(event, newValue) => {
                                setCarMonthRate(event.target.value);
                            }}
                            autoComplete='off'
                            label="Monthly Rate"
                            placeholder='2000000'
                            type='number'
                            onFocus={event => {
                                event.target.select();
                            }}
                            // InputProps={{
                            // startAdornment: (
                            //     <InputAdornment position="start">
                            //         <AccountCircle/>
                            //     </InputAdornment>
                            // ),
                            // }}
                            sx={{
                                width: '100%',
                            }}
                            variant="outlined"
                            />
                        </Box>
                        {/* image */}
                        <Box
                        sx={{
                            width: '100%',
                            padding: '10px'
                        }}>
                            
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="file_input">Upload Image</label>
                        <input onChange={uploadToClient} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file"/>

                        </Box>
                        {/* car rating & submit */}
                        <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                        >
                            <Box
                            sx={{
                                display: 'flex',
                                paddingLeft: '15px',
                                alignItems: 'center'
                            }}>
                                <Box>
                                    <Typography>
                                        Rating: 
                                    </Typography>
                                </Box>
                                <Box
                                sx={{
                                    display: 'flex',
                                    paddingLeft: '10px',
                                }}>
                                    <Rating
                                        size="large"
                                        name="rating-hover-feedback"
                                        value={carRating}
                                        precision={0.5}
                                        getLabelText={getLabelText}
                                        onChange={(event, newValue) => {
                                            setCarRating(Number(event.target.value));
                                        }}
                                        onChangeActive={(event, newHover) => {
                                        setCarRatingHover(newHover);
                                        }}
                                        emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
                                    />
                                    {carRating !== null && (
                                        <Box sx={{ ml: 2 }}>{carRatingLabels[carRatingHover !== -1 ? carRatingHover : carRating]}</Box>
                                    )}
                                </Box>
                            </Box>
                            <Box
                            sx={{
                                paddingRight: '20px'
                            }}>
                                <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={submitCreateCar}>
                                    submit
                                </button>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
                {/* uploaded image */}
                <Grid
                container={true}
                direction="column"
                spacing={0}
                sx={{
                    display: 'flex',
                    width: '50%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Box>
                        <img src={createObjectURL} style={{
                            objectFit: 'contain',
                            maxHeight: '50vh',
                            maxWidth: '50vw'
                        }}/>
                    </Box>
                </Grid>
            </Grid>
            </Dialog>
            {/* modal edit Car */}
            <Dialog
            fullScreen
            open={dialogEditCar}
            onClose={handleCloseDialogEditCar}
            TransitionComponent={Transition}
            >
            <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
                <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseDialogEditCar}
                aria-label="close"
                >
                <Close/>
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    Edit Car
                </Typography>
            </Toolbar>
            </AppBar>
            {/* body */}
            <Grid
            container={true}
            direction="row"
            spacing={0}
            sx={{
                display: 'flex',
                width: '100%',
                height: '100%',
                padding: '50px',
                justifyContent: 'flex-start',
                alignItems: 'flex-start'
            }}>
                {/* car data form */}
                <Grid
                container={true}
                direction="column"
                spacing={0}
                sx={{
                    display: 'flex',
                    width: '50%',
                    height: '100%',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start'
                }}>
                    <Grid
                    container={true}
                    direction="column"
                    spacing={0}
                    sx={{
                        display: 'flex',
                        width: '100%',
                        paddingY: '10px',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end'
                    }}>
                        {/* car name */}
                        <Box
                        sx={{
                            width: '100%',
                            padding: '10px',
                        }}>
                            <TextField
                            size='small'
                            value={carName}
                            onChange={(event, newValue) => {
                                setCarName(event.target.value);
                            }}
                            autoComplete='off'
                            label="Car Name"
                            placeholder='Mobil A'
                            // InputProps={{
                            // startAdornment: (
                            //     <InputAdornment position="start">
                            //         <AccountCircle/>
                            //     </InputAdornment>
                            // ),
                            // }}
                            sx={{
                                width: '100%',
                            }}
                            variant="outlined"
                            />
                        </Box>
                        {/* car type */}
                        <Box
                        sx={{
                            width: '100%',
                            padding: '10px',
                        }}>
                            <TextField
                            size='small'
                            value={carType}
                            onChange={(event, newValue) => {
                                setCarType(event.target.value);
                            }}
                            autoComplete='off'
                            label="Car Type"
                            placeholder='Tipe A'
                            // InputProps={{
                            // startAdornment: (
                            //     <InputAdornment position="start">
                            //         <Phone/>
                            //     </InputAdornment>
                            // ),
                            // }}
                            sx={{
                                width: '100%',
                            }}
                            variant="outlined"
                            />
                        </Box>
                        {/* fuel */}
                        <Box
                        sx={{
                            width: '100%',
                            padding: '10px',
                            display : 'flex',
                            flexDirection: 'row'
                        }}>
                            <FormControl
                            sx={{
                                width: '100%'
                            }}>
                                <InputLabel id="demo-simple-select-label">Fuel Type</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                sx={{
                                    width: '100%'
                                }}
                                value={carFuel}
                                label="Fuel Type"
                                onChange={(event, newValue) => {
                                    setCarFuel(event.target.value);
                                }}
                                >
                                    <MenuItem value={'gasoline'}>Gasoline</MenuItem>
                                    <MenuItem value={'diesel fueled'}>Diesel Fueled</MenuItem>
                                    <MenuItem value={'electric'}>Electric</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        {/* car hourly Rate */}
                        <Box
                        sx={{
                            width: '100%',
                            padding: '10px',
                        }}>
                            <TextField
                            size='small'
                            value={carHourRate}
                            onChange={(event, newValue) => {
                                setCarHourRate(event.target.value);
                            }}
                            autoComplete='off'
                            label="Hourly Rate"
                            placeholder='50000'
                            type='number'
                            onFocus={event => {
                                event.target.select();
                            }}
                            // InputProps={{
                            // startAdornment: (
                            //     <InputAdornment position="start">
                            //         <AccountCircle/>
                            //     </InputAdornment>
                            // ),
                            // }}
                            sx={{
                                width: '100%',
                            }}
                            variant="outlined"
                            />
                        </Box>
                        {/* car daily Rate */}
                        <Box
                        sx={{
                            width: '100%',
                            padding: '10px',
                        }}>
                            <TextField
                            size='small'
                            value={carDayRate}
                            onChange={(event, newValue) => {
                                setCarDayRate(event.target.value);
                            }}
                            autoComplete='off'
                            label="Daily Rate"
                            placeholder='200000'
                            type='number'
                            onFocus={event => {
                                event.target.select();
                            }}
                            // InputProps={{
                            // startAdornment: (
                            //     <InputAdornment position="start">
                            //         <AccountCircle/>
                            //     </InputAdornment>
                            // ),
                            // }}
                            sx={{
                                width: '100%',
                            }}
                            variant="outlined"
                            />
                        </Box>
                        {/* car monthly Rate */}
                        <Box
                        sx={{
                            width: '100%',
                            padding: '10px',
                        }}>
                            <TextField
                            size='small'
                            value={carMonthRate}
                            onChange={(event, newValue) => {
                                setCarMonthRate(event.target.value);
                            }}
                            autoComplete='off'
                            label="Monthly Rate"
                            placeholder='2000000'
                            type='number'
                            onFocus={event => {
                                event.target.select();
                            }}
                            // InputProps={{
                            // startAdornment: (
                            //     <InputAdornment position="start">
                            //         <AccountCircle/>
                            //     </InputAdornment>
                            // ),
                            // }}
                            sx={{
                                width: '100%',
                            }}
                            variant="outlined"
                            />
                        </Box>
                        {/* image */}
                        <Box
                        sx={{
                            width: '100%',
                            padding: '10px'
                        }}>
                            
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="file_input">Upload Image</label>
                        <input onChange={uploadToClient} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file"/>

                        </Box>
                        {/* car rating & submit */}
                        <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                        >
                            <Box
                            sx={{
                                display: 'flex',
                                paddingLeft: '15px',
                                alignItems: 'center'
                            }}>
                                <Box>
                                    <Typography>
                                        Rating: 
                                    </Typography>
                                </Box>
                                <Box
                                sx={{
                                    display: 'flex',
                                    paddingLeft: '10px',
                                }}>
                                    <Rating
                                        size="large"
                                        name="rating-hover-feedback"
                                        value={carRating}
                                        precision={0.5}
                                        getLabelText={getLabelText}
                                        onChange={(event, newValue) => {
                                            setCarRating(Number(event.target.value));
                                        }}
                                        onChangeActive={(event, newHover) => {
                                        setCarRatingHover(newHover);
                                        }}
                                        emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
                                    />
                                    {carRating !== null && (
                                        <Box sx={{ ml: 2 }}>{carRatingLabels[carRatingHover !== -1 ? carRatingHover : carRating]}</Box>
                                    )}
                                </Box>
                            </Box>
                            <Box
                            sx={{
                                paddingRight: '20px'
                            }}>
                                <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => submitUpdateCar(selectedCar)}>
                                    submit
                                </button>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
                {/* uploaded image */}
                <Grid
                container={true}
                direction="column"
                spacing={0}
                sx={{
                    display: 'flex',
                    width: '50%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Box>
                        <img src={createObjectURL} style={{
                            objectFit: 'contain',
                            maxHeight: '50vh',
                            maxWidth: '50vw'
                        }}/>
                    </Box>
                </Grid>
            </Grid>
            </Dialog>
            {/* modal delete car */}
            <Dialog
            open={dialogDeleteCar}
            onClose={handleCloseDialogDeleteCar}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Delete Car"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    are you sure you want to delete this car?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleCloseDialogDeleteCar}>Cancel</Button>
                <Button onClick={submitDeleteCar} autoFocus>
                    Delete
                </Button>
                </DialogActions>
            </Dialog>

            {/* modal create order */}
            <Dialog
            fullScreen
            open={dialogCreateOrder}
            onClose={handleCloseDialogCreateOrder}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
                <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseDialogCreateOrder}
                aria-label="close"
                >
                <Close/>
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    Create Order
                </Typography>
            </Toolbar>
            </AppBar>
            {/* body */}
            <Grid
            container={true}
            direction="row"
            spacing={0}
            sx={{
                display: 'flex',
                width: '100%',
                height: '100%',
                padding: '50px',
                justifyContent: 'flex-start',
                alignItems: 'flex-start'
            }}>
                {/* car data form */}
                <Grid
                container={true}
                direction="column"
                spacing={0}
                sx={{
                    display: 'flex',
                    width: '50%',
                    height: '100%',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start'
                }}>
                    <Grid
                    container={true}
                    direction="column"
                    spacing={0}
                    sx={{
                        display: 'flex',
                        width: '100%',
                        paddingY: '10px',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end'
                    }}>
                        {/* select car */}
                        <Box
                        sx={{
                            width: '100%',
                            padding: '10px',
                            display : 'flex',
                            flexDirection: 'column'
                        }}>
                            <FormControl
                            sx={{
                                width: '100%'
                            }}>
                                <InputLabel id="order-car-select-label">Car Name</InputLabel>
                                <Select
                                labelId="order-car-select-label"
                                id="order-car-select"
                                sx={{
                                    width: '100%'
                                }}
                                value={orderCar}
                                label="Car Name"
                                onChange={(event, newValue) => {
                                    setOrderCar(event.target.value);
                                }}
                                >
                                    {cars?.map((car, index) => (
                                        <MenuItem key={`car-option-${index}`} value={car}>{car.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {
                                orderCar.id
                                ?
                                <Grid
                                container={true}
                                direction="row"
                                spacing={0}
                                sx={{
                                    marginTop: '5px',
                                    display: 'flex',
                                    width: '100%%',
                                    height: '100%',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center'
                                }}>
                                    <Box>
                                        <Typography
                                        sx={{
                                            fontSize: '12px'
                                        }}>
                                            rating: {orderCar.rating}
                                        </Typography>
                                    </Box>
                                    <Divider orientation="vertical" flexItem sx={{ marginX: '5px'}}/>
                                    <Box>
                                        <Typography
                                        sx={{
                                            fontSize: '12px'
                                        }}>
                                            hourly rate: Rp. {orderCar.hour_rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </Typography>
                                    </Box>
                                    <Divider orientation="vertical" flexItem sx={{ marginX: '5px'}}/>
                                    <Box>
                                        <Typography
                                        sx={{
                                            fontSize: '12px'
                                        }}>
                                            daily rate: Rp. {orderCar.day_rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </Typography>
                                    </Box>
                                    <Divider orientation="vertical" flexItem sx={{ marginX: '5px'}}/>
                                    <Box>
                                        <Typography
                                        sx={{
                                            fontSize: '12px'
                                        }}>
                                            monthly rate: Rp. {orderCar.month_rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </Typography>
                                    </Box>
                                </Grid>
                                :
                                null
                            }
                        </Box>
                        {/* pick up location */}
                        <Box
                        sx={{
                            width: '100%',
                            padding: '10px',
                        }}>
                            <TextField
                            size='small'
                            value={orderPickUpLoc}
                            onChange={(event, newValue) => {
                                setOrderPickUpLoc(event.target.value);
                            }}
                            autoComplete='off'
                            label="Pick Up Location"
                            placeholder='Semarang'
                            // InputProps={{
                            // startAdornment: (
                            //     <InputAdornment position="start">
                            //         <AccountCircle/>
                            //     </InputAdornment>
                            // ),
                            // }}
                            sx={{
                                width: '100%',
                            }}
                            variant="outlined"
                            />
                        </Box>
                        {/* drop off location */}
                        <Box
                        sx={{
                            width: '100%',
                            padding: '10px',
                        }}>
                            <TextField
                            size='small'
                            value={orderDropOffLoc}
                            onChange={(event, newValue) => {
                                setOrderDropOffLoc(event.target.value);
                            }}
                            autoComplete='off'
                            label="Drop Off Location"
                            placeholder='Jakarta'
                            // InputProps={{
                            // startAdornment: (
                            //     <InputAdornment position="start">
                            //         <Phone/>
                            //     </InputAdornment>
                            // ),
                            // }}
                            sx={{
                                width: '100%',
                            }}
                            variant="outlined"
                            />
                        </Box>
                        {/* pick up & drop off datetime */}
                        <Box
                        sx={{
                            width: '100%',
                            padding: '10px',
                        }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid
                                container={true}
                                direction="row"
                                spacing={0}
                                sx={{
                                    display: 'flex',
                                    width: '100%',
                                    height: '100%',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <DateTimePicker
                                    sx={{
                                        width: '45%'
                                    }}
                                    label="Pick Up Date"
                                    value={orderPickUpDate}
                                    onChange={(newValue) => setOrderPickUpDate(dayjs(newValue).valueOf())}
                                    slotProps={{ textField: { size: 'small' } }}
                                    />
                                    <Typography>
                                        -
                                    </Typography>
                                    <DateTimePicker
                                    sx={{
                                        width: '45%'
                                    }}
                                    label="Drop Off Date"
                                    value={orderDropOffDate}
                                    onChange={(newValue) => setOrderDropOffDate(dayjs(newValue).valueOf())}
                                    slotProps={{ textField: { size: 'small' } }}
                                    />
                                </Grid>
                            </LocalizationProvider>
                        </Box>
                        {/* submit button*/}
                        <Box
                        sx={{
                            paddingRight: '10px'
                        }}>
                            <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={submitCreateOrder}>
                                submit
                            </button>
                        </Box>
                    </Grid>
                </Grid>
                {/* uploaded image */}
                <Grid
                container={true}
                direction="column"
                spacing={0}
                sx={{
                    display: 'flex',
                    width: '50%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Box>
                        <img src={createObjectURL} style={{
                            objectFit: 'contain',
                            maxHeight: '50vh',
                            maxWidth: '50vw'
                        }}/>
                    </Box>
                </Grid>
            </Grid>
            </Dialog>
            {/* modal edit order */}
            <Dialog
            fullScreen
            open={dialogEditOrder}
            onClose={handleCloseDialogEditOrder}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
                <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseDialogEditOrder}
                aria-label="close"
                >
                <Close/>
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    Edit Order
                </Typography>
            </Toolbar>
            </AppBar>
            {/* body */}
            <Grid
            container={true}
            direction="row"
            spacing={0}
            sx={{
                display: 'flex',
                width: '100%',
                height: '100%',
                padding: '50px',
                justifyContent: 'flex-start',
                alignItems: 'flex-start'
            }}>
                {/* car data form */}
                <Grid
                container={true}
                direction="column"
                spacing={0}
                sx={{
                    display: 'flex',
                    width: '50%',
                    height: '100%',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start'
                }}>
                    <Grid
                    container={true}
                    direction="column"
                    spacing={0}
                    sx={{
                        display: 'flex',
                        width: '100%',
                        paddingY: '10px',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end'
                    }}>
                        {/* select car */}
                        <Box
                        sx={{
                            width: '100%',
                            padding: '10px',
                            display : 'flex',
                            flexDirection: 'column'
                        }}>
                            <FormControl
                            sx={{
                                width: '100%'
                            }}>
                                <InputLabel id="order-car-select-label">Car Name</InputLabel>
                                <Select
                                labelId="order-car-select-label"
                                id="order-car-select"
                                sx={{
                                    width: '100%'
                                }}
                                value={orderCar}
                                label="Car Name"
                                onChange={e => setOrderCar(e.target.value)}
                                >
                                    {cars.map((car, index) => (
                                        <MenuItem key={`car-option-${index}`} value={car}>{car.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {
                                orderCar.id
                                ?
                                <Grid
                                container={true}
                                direction="row"
                                spacing={0}
                                sx={{
                                    marginTop: '5px',
                                    display: 'flex',
                                    width: '100%%',
                                    height: '100%',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center'
                                }}>
                                    <Box>
                                        <Typography
                                        sx={{
                                            fontSize: '12px'
                                        }}>
                                            rating: {orderCar.rating}
                                        </Typography>
                                    </Box>
                                    <Divider orientation="vertical" flexItem sx={{ marginX: '5px'}}/>
                                    <Box>
                                        <Typography
                                        sx={{
                                            fontSize: '12px'
                                        }}>
                                            hourly rate: Rp. {orderCar.hour_rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </Typography>
                                    </Box>
                                    <Divider orientation="vertical" flexItem sx={{ marginX: '5px'}}/>
                                    <Box>
                                        <Typography
                                        sx={{
                                            fontSize: '12px'
                                        }}>
                                            daily rate: Rp. {orderCar.day_rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </Typography>
                                    </Box>
                                    <Divider orientation="vertical" flexItem sx={{ marginX: '5px'}}/>
                                    <Box>
                                        <Typography
                                        sx={{
                                            fontSize: '12px'
                                        }}>
                                            monthly rate: Rp. {orderCar.month_rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </Typography>
                                    </Box>
                                </Grid>
                                :
                                null
                            }
                        </Box>
                        {/* pick up location */}
                        <Box
                        sx={{
                            width: '100%',
                            padding: '10px',
                        }}>
                            <TextField
                            size='small'
                            value={orderPickUpLoc}
                            onChange={(event, newValue) => {
                                setOrderPickUpLoc(event.target.value);
                            }}
                            autoComplete='off'
                            label="Pick Up Location"
                            placeholder='Semarang'
                            // InputProps={{
                            // startAdornment: (
                            //     <InputAdornment position="start">
                            //         <AccountCircle/>
                            //     </InputAdornment>
                            // ),
                            // }}
                            sx={{
                                width: '100%',
                            }}
                            variant="outlined"
                            />
                        </Box>
                        {/* drop off location */}
                        <Box
                        sx={{
                            width: '100%',
                            padding: '10px',
                        }}>
                            <TextField
                            size='small'
                            value={orderDropOffLoc}
                            onChange={(event, newValue) => {
                                setOrderDropOffLoc(event.target.value);
                            }}
                            autoComplete='off'
                            label="Drop Off Location"
                            placeholder='Jakarta'
                            // InputProps={{
                            // startAdornment: (
                            //     <InputAdornment position="start">
                            //         <Phone/>
                            //     </InputAdornment>
                            // ),
                            // }}
                            sx={{
                                width: '100%',
                            }}
                            variant="outlined"
                            />
                        </Box>
                        {/* pick up & drop off datetime */}
                        <Box
                        sx={{
                            width: '100%',
                            padding: '10px',
                        }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid
                                container={true}
                                direction="row"
                                spacing={0}
                                sx={{
                                    display: 'flex',
                                    width: '100%',
                                    height: '100%',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <DateTimePicker
                                    sx={{
                                        width: '45%'
                                    }}
                                    label="Pick Up Date"
                                    value={orderPickUpDate}
                                    onChange={(newValue) => setOrderPickUpDate(dayjs(newValue).valueOf())}
                                    slotProps={{ textField: { size: 'small' } }}
                                    />
                                    <Typography>
                                        -
                                    </Typography>
                                    <DateTimePicker
                                    sx={{
                                        width: '45%'
                                    }}
                                    label="Drop Off Date"
                                    value={orderDropOffDate}
                                    onChange={(newValue) => setOrderDropOffDate(dayjs(newValue).valueOf())}
                                    slotProps={{ textField: { size: 'small' } }}
                                    />
                                </Grid>
                            </LocalizationProvider>
                        </Box>
                        {/* submit button*/}
                        <Box
                        sx={{
                            paddingRight: '10px'
                        }}>
                            <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={submitUpdateOrder}>
                                submit
                            </button>
                        </Box>
                    </Grid>
                </Grid>
                {/* uploaded image */}
                <Grid
                container={true}
                direction="column"
                spacing={0}
                sx={{
                    display: 'flex',
                    width: '50%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Box>
                        <img src={createObjectURL} style={{
                            objectFit: 'contain',
                            maxHeight: '50vh',
                            maxWidth: '50vw'
                        }}/>
                    </Box>
                </Grid>
            </Grid>
            </Dialog>
            {/* modal delete order */}
            <Dialog
            open={dialogDeleteOrder}
            onClose={handleCloseDialogDeleteOrder}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Delete Order"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    are you sure you want to delete this order?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleCloseDialogDeleteOrder}>Cancel</Button>
                <Button onClick={submitDeleteOrder} autoFocus>
                    Delete
                </Button>
                </DialogActions>
            </Dialog>

            {/* header */}
            <Grid
            container={true}
            direction="row"
            spacing={0}
            sx={{
                display: 'flex',
                width: '100%',
                height: '50px',
                paddingX: '20px',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#1976d2',
            }}>
                <Box>
                    <Typography
                    sx={{
                        color: '#eee',
                        fontSize: '18px',
                        fontWeight: 500
                    }}>
                        Rental
                    </Typography>
                </Box>
                <Box>
                    <Typography
                    sx={{
                        color: '#eee',
                        fontSize: '14px',
                        fontWeight: 400
                    }}>
                        {user.name}
                    </Typography>
                </Box>
            </Grid>

            {/* tab menu */}
            {
                user.role_id !== 1
                ?
                null
                :
                <Grid
                container={true}
                direction="column"
                spacing={0}
                sx={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                }}>
                    <Grid
                    container={true}
                    direction="row"
                    spacing={0}
                    sx={{
                        display: 'flex',
                        width: '100%',
                        marginTop: '10px',
                        justifyContent: 'space-evenly',
                        alignItems: 'center'
                    }}>
                        <Button 
                        sx={{
                            width: '48%'
                        }}
                        onClick={() => slideTo(0)}
                        variant="outlined"
                        >
                            Orders
                        </Button>
                        <Button
                        sx={{
                            width: '48%'
                        }}
                        onClick={() => slideTo(1)}
                        variant="outlined">
                            Cars
                        </Button>
                    </Grid>
                </Grid>
            }

            {/* swiper */}
            <Box
            sx={{
                width: '100%'
            }}>
                <Swiper
                onSwiper={setSwiper}
                touchMoveStopPropagation={false}
                allowTouchMove={false}
                autoHeight={true}
                slidesPerView={1}
                slidesPerGroup={1}>
                    {/* orders swiper slide */}
                    <SwiperSlide>
                        <Grid
                        container={true}
                        direction="column"
                        spacing={0}
                        sx={{
                            display: 'flex',
                            width: '100%',
                            height: '100%',
                        }}>
                            <Box
                            sx={{
                                marginTop: '20px',
                                paddingX: '20px',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                            }}>
                                <button
                                onClick={handleOpenDialogCreateOrder}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Create Order
                                </button>
                            </Box>
                            <Grid
                            container={true}
                            direction="row"
                            spacing={0}
                            sx={{
                                paddingX: '100px',
                                marginTop: '50px',
                                display: 'flex',
                                flexWrap: 'wrap',
                                width: '100%',
                                height: '100%',
                            }}>
                                {/* order card */}
                                {orders?.map((order, index) => (
                                    <Paper
                                    key={`order-card-${index}`}
                                    elevation={2}
                                    sx={{
                                        margin: '10px',
                                        backgroundColor: '#efefef'
                                    }}>
                                        <Grid
                                        container={true}
                                        direction="column"
                                        spacing={0}
                                        sx={{
                                            padding: '10px',
                                            display: 'flex',
                                            width: '100%',
                                            height: '100%',
                                        }}>
                                            <Box
                                            sx={{
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                            }}>
                                                <img
                                                src={`${process.env.NEXT_PUBLIC_API_BACKEND+order.car_image}`}
                                                style={{
                                                    width: '200px',
                                                    height: '200px',
                                                    objectFit: 'contain'
                                                }}></img>
                                            </Box>
                                            <Box
                                            sx={{
                                                width: '100%',
                                                marginTop: '10px',
                                            }}>
                                                <Typography
                                                sx={{
                                                    fontSize: '14px',
                                                    fontWeight: 400
                                                }}>
                                                    user: {order.user_name}
                                                </Typography>
                                            </Box>
                                            <Box
                                            sx={{
                                                width: '100%',
                                            }}>
                                                <Typography
                                                sx={{
                                                    fontSize: '14px',
                                                    fontWeight: 400
                                                }}>
                                                    car: {order.car_name}
                                                </Typography>
                                            </Box>
                                            <Box
                                            sx={{
                                                width: '100%',
                                            }}>
                                                <Typography
                                                sx={{
                                                    fontSize: '14px',
                                                    fontWeight: 400
                                                }}>
                                                    pickup location: {order.pick_up_loc}
                                                </Typography>
                                            </Box>
                                            <Box
                                            sx={{
                                                width: '100%',
                                            }}>
                                                <Typography
                                                sx={{
                                                    fontSize: '14px',
                                                    fontWeight: 400
                                                }}>
                                                    drop off location: {order.drop_off_loc}
                                                </Typography>
                                            </Box>
                                            <Box
                                            sx={{
                                                width: '100%',
                                            }}>
                                                <Typography
                                                sx={{
                                                    fontSize: '14px',
                                                    fontWeight: 400
                                                }}>
                                                    pickup date: {order.pick_up_date}
                                                </Typography>
                                            </Box>
                                            <Box
                                            sx={{
                                                width: '100%',
                                            }}>
                                                <Typography
                                                sx={{
                                                    fontSize: '14px',
                                                    fontWeight: 400
                                                }}>
                                                    drop off date: {order.drop_off_date}
                                                </Typography>
                                            </Box>
                                            <Box
                                            sx={{
                                                width: '100%',
                                            }}>
                                                <Typography
                                                sx={{
                                                    fontSize: '14px',
                                                    fontWeight: 400
                                                }}>
                                                    pickup time: {order.pick_up_time}
                                                </Typography>
                                            </Box>
                                            <Box
                                            sx={{
                                                width: '100%',
                                                display: 'flex',
                                                marginTop: '20px',
                                                justifyContent: 'space-evenly'
                                            }}>
                                                <button
                                                onClick={() => handleOpenDialogEditOrder(order.id)}
                                                type="button"
                                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                    <Edit/>
                                                </button>
                                                {
                                                    user.role_id !== 1
                                                    ?
                                                    null
                                                    :
                                                    <button
                                                    onClick={() => handleOpenDialogDeleteOrder(order.id)}
                                                    type="button" 
                                                    className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                                                        <Delete/>
                                                    </button>
                                                }
                                            </Box>
                                        </Grid>
                                    </Paper>
                                ))}
                            </Grid>
                        </Grid>
                    </SwiperSlide>
                    {/* cars swiper slide */}
                    <SwiperSlide>
                        <Grid
                        container={true}
                        direction="column"
                        spacing={0}
                        sx={{
                            display: 'flex',
                            width: '100%',
                            height: '100%',
                        }}>
                            <Box
                            sx={{
                                marginTop: '20px',
                                paddingX: '20px',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                            }}>
                                <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={handleOpenDialogCreateCar}>
                                    Create Car
                                </button>
                            </Box>
                            <Grid
                            container={true}
                            direction="row"
                            spacing={0}
                            sx={{
                                paddingX: '100px',
                                marginTop: '50px',
                                display: 'flex',
                                flexWrap: 'wrap',
                                width: '100%',
                                height: '100%',
                            }}>
                                {/* car card */}
                                {cars?.map((car, index) => (
                                    <Paper
                                    key={`car-card-${index}`}
                                    elevation={2}
                                    sx={{
                                        margin: '10px',
                                        backgroundColor: '#efefef'
                                    }}>
                                        <Grid
                                        container={true}
                                        direction="column"
                                        spacing={0}
                                        sx={{
                                            padding: '10px',
                                            display: 'flex',
                                            width: '100%',
                                            height: '100%',
                                        }}>
                                            <Box
                                            sx={{
                                                width: '100%'
                                            }}>
                                                <img
                                                src={`${process.env.NEXT_PUBLIC_API_BACKEND+car.image}`}
                                                style={{
                                                    width: '200px',
                                                    height: '200px',
                                                    objectFit: 'contain'
                                                }}></img>
                                            </Box>
                                            <Box
                                            sx={{
                                                width: '100%',
                                                marginTop: '10px'
                                            }}>
                                                <Typography
                                                sx={{
                                                    fontSize: '14px',
                                                    fontWeight: 400
                                                }}>
                                                    name: {car.name}
                                                </Typography>
                                            </Box>
                                            <Box
                                            sx={{
                                                width: '100%',
                                            }}>
                                                <Typography
                                                sx={{
                                                    fontSize: '14px',
                                                    fontWeight: 400
                                                }}>
                                                    type: {car.car_type}
                                                </Typography>
                                            </Box>
                                            <Box
                                            sx={{
                                                width: '100%',
                                            }}>
                                                <Typography
                                                sx={{
                                                    fontSize: '14px',
                                                    fontWeight: 400
                                                }}>
                                                    fuel: {car.fuel}
                                                </Typography>
                                            </Box>
                                            <Box
                                            sx={{
                                                width: '100%',
                                            }}>
                                                <Typography
                                                sx={{
                                                    fontSize: '14px',
                                                    fontWeight: 400
                                                }}>
                                                    hourly rate: Rp. {car.hour_rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                </Typography>
                                            </Box>
                                            <Box
                                            sx={{
                                                width: '100%',
                                            }}>
                                                <Typography
                                                sx={{
                                                    fontSize: '14px',
                                                    fontWeight: 400
                                                }}>
                                                    daily rate: Rp. {car.day_rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                </Typography>
                                            </Box>
                                            <Box
                                            sx={{
                                                width: '100%',
                                            }}>
                                                <Typography
                                                sx={{
                                                    fontSize: '14px',
                                                    fontWeight: 400
                                                }}>
                                                    monthly rate: Rp. {car.month_rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                </Typography>
                                            </Box>
                                            <Box
                                            sx={{
                                                width: '100%',
                                                display: 'flex'
                                            }}>
                                                <Typography
                                                sx={{
                                                    fontSize: '14px',
                                                    fontWeight: 400
                                                }}>
                                                    rating: 
                                                </Typography>
                                                <Rating size='small' precision={0.5} name="read-only-rating" value={car.rating} readOnly />
                                            </Box>
                                            <Box
                                            sx={{
                                                width: '100%',
                                                display: 'flex',
                                                marginTop: '20px',
                                                justifyContent: 'space-evenly'
                                            }}>
                                                <button
                                                onClick={() => handleOpenDialogEditCar(car.id)}
                                                type="button"
                                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                    <Edit/>
                                                </button>
                                                <button
                                                onClick={() => handleOpenDialogDeleteCar(car.id)}
                                                type="button" 
                                                className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                                                    <Delete/>
                                                </button>
                                            </Box>
                                        </Grid>
                                    </Paper>
                                ))}
                            </Grid>
                        </Grid>
                    </SwiperSlide>
                </Swiper>
            </Box>
        </Grid>
    )
}
