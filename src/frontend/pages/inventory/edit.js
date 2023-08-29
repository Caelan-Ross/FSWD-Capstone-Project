import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
    Typography,
    Box,
    IconButton,
    TextField,
    Button,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { Snackbar, SnackbarContent } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import axios from 'axios';

export default function BatteryEdit() {
    const router = useRouter();
    const { id } = router.query;
    const handleNavigation = (path) => {
        router.push(path);
    };

    const [isError, setIsError] = useState(null);
    const [showSnackbar, setShowSnackbar] = useState(false);

    // Load existing asset data when component mounts
    const [formState, setFormState] = useState({
        typeName: '',
        modelName: '',
        makeName: '',
        conditionName: '',
        voltage: 0,
        capacity: 0,
        price: 0,
        groupName: '',
        length: 0,
        width: 0,
        height: 0,
        unitType: '',
    });

    useEffect(() => {
        if (id) {
            axios
                .get(`http://localhost:7166/api/Batteries/${id}`)
                .then((response) => {
                    // Map API response keys to formState keys
                    const mappedData = {
                        typeName: response.data.typeName,
                        modelName: response.data.modelName,
                        makeName: response.data.makeName,
                        conditionName: response.data.conditionName,
                        voltage: response.data.voltage,
                        capacity: response.data.capacity,
                        price: response.data.price,
                        groupName: response.data.groupName,
                        length: response.data.length,
                        width: response.data.width,
                        height: response.data.height,
                        unitType: response.data.unitType,
                        typeId: response.data.typeId, // Add this line
                    };
                    setFormState(mappedData);
                })
                .catch((error) => {
                    console.error('Error fetching asset data:', error);
                });
        }
    }, [id]);

    const isFormValid = () => {
        // Checks if all required fields are filled
        return (
            formState.typeName &&
            formState.modelName &&
            formState.makeName &&
            formState.conditionName &&
            formState.voltage &&
            formState.capacity &&
            formState.price &&
            formState.groupName &&
            formState.length &&
            formState.width &&
            formState.height &&
            formState.unitType
        );
    };


    // Dropdown options consts

    // Types
    const [typeOptions, setTypeOptions] = useState([]);

    // Models
    const [modelOptions, setModelOptions] = useState([]);

    // Makes
    const [makeOptions, setMakeOptions] = useState([]);

    // Conditions
    const [conditionOptions, setConditionOptions] = useState([
        'New',
        'Used',
        'Refurbished',
    ]);

    // Groups
    const [groupOptions, setGroupOptions] = useState([]);

    // Unit Types
    const [unitTypeOptions, setUnitTypeOptions] = useState([]);

    // Input change functions for tracking state across form entries
    const handleInputChange = (field, value) => {
        setFormState(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    // Form submit function
    // Update an existing battery using a PUT request
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!isFormValid()) {
            return; // Don't proceed if the form is not valid
        }

        try {
            setIsError(null);

            // Validate and transform data if necessary
            const requestData = formState;

            await axios.put(`http://localhost:7166/api/Batteries/${id}`, requestData)
                .then((response) => {
                    setShowSnackbar(true);
                    setTimeout(() => {
                        setShowSnackbar(false);
                        router.push('/inventory');
                    }, 2000);
                    console.log('Successfully updated:', response.data);
                })
                .catch((error) => {
                    setIsError('Failed to update asset');
                    console.error('Error updating battery:', error);
                });
        } finally {
            console.log('Update attempt completed');
        }
    };

    // API Calls
    useEffect(() => {
        // // Fetch data for battery dropdown
        // axios
        //     .get('http://localhost:7166/api/Batteries')
        //     .then((response) => {
        //         setBatteryOption(response.data);
        //     })
        //     .catch((error) => {
        //         console.error('Error fetching type options:', error);
        //     });
        // Fetch data for battery type dropdown
        axios
            .get('http://localhost:7166/api/BatteryTypes')
            .then((response) => {
                setTypeOptions(response.data);
            })
            .catch((error) => {
                console.error('Error fetching type options:', error);
            });

        // Fetch data for battery model dropdown
        axios
            .get('http://localhost:7166/api/BatteryModels')
            .then((response) => {
                setModelOptions(response.data);
            })
            .catch((error) => {
                console.error('Error fetching model options:', error);
            });

        // Fetch data for battery make dropdown
        axios
            .get('http://localhost:7166/api/BatteryMakes')
            .then((response) => {
                console.log('API Response:', response.data);
                setMakeOptions(response.data);
            })
            .catch((error) => {
                console.error('Error fetching make options:', error);
            });

        // Fetch data for battery group dropdown
        axios
            .get('http://localhost:7166/api/BatteryGroups')
            .then((response) => {
                setGroupOptions(response.data);
            })
            .catch((error) => {
                console.error('Error fetching group options:', error);
            });

        // Fetch data for unit type dropdown
        axios
            .get('http://localhost:7166/api/Units')
            .then((response) => {
                setUnitTypeOptions(response.data);
            })
            .catch((error) => {
                console.error('Error fetching unit type options:', error);
            });

        // // Fetch serial number
        // axios
        //     .get('http://localhost:7166/api/assets')
        //     .then((response) => {
        //         // Find the matching serial number using id
        //         const batterySerial = response.data.find(asset => asset.id === id)?.stampedSerial;
        //         if (batterySerial) {
        //             setFormState(prevState => ({
        //                 ...prevState,
        //                 stampedSerial: batterySerial
        //             }));
        //         }
        //     })
        //     .catch((error) => {
        //         console.error('Error fetching serial number:', error);
        //     });
    }, []);

    // useEffect(() => {
    //     if (id) {
    //         // Fetch serial number
    //         axios
    //             .get('http://localhost:7166/api/assets')
    //             .then((response) => {
    //                 // Find the matching serial number using id
    //                 const batterySerial = response.data.find(asset => asset.id === id)?.stampedSerial;
    //                 if (batterySerial) {
    //                     setFormState(prevState => ({
    //                         ...prevState,
    //                         stampedSerial: batterySerial
    //                     }));
    //                 }
    //             })
    //             .catch((error) => {
    //                 console.error('Error fetching serial number:', error);
    //             });
    //     }
    // }, [id]);


    return (
        <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            sx={{
                backgroundColor: '#E6E8E7',
                borderRadius: '8px',
                margin: '.25rem auto',
                padding: '.5rem 1rem',
                height: '82vh',
                overflow: 'auto',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                }}
            >
                <Typography variant='h3' align='center' component='h2' className='header-text'>
                    Edit Battery
                </Typography>
                <Box display='flex' onClick={() => handleNavigation('/inventory')}>
                    <IconButton>
                        <ArrowCircleLeftIcon
                            sx={{ fontSize: '2.5rem', color: '#000000' }}
                        />
                    </IconButton>
                </Box>
            </Box>

            {/* Type Dropdown */}
            <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Type</InputLabel>
                <Select
                    value={formState.typeId}
                    onChange={(e) => handleInputChange('typeId', e.target.value)}
                    sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                >
                    {/* Existing type options */}
                    {typeOptions.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                            {type.typeName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Model Dropdown */}
            <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Model</InputLabel>
                <Select
                    value={formState.modelName}
                    onChange={(e) => handleInputChange('modelName', e.target.value)}
                    sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                >
                    {/* Existing model options */}
                    {modelOptions.map((model) => (
                        <MenuItem key={model.id} value={model.modelName}>
                            {model.modelName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Make Dropdown */}
            <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Make</InputLabel>
                <Select
                    sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                    value={formState.makeName}
                    onChange={(e) => handleInputChange('makeName', e.target.value)}
                >
                    {/* Existing make options */}
                    {makeOptions.map((make) => (
                        <MenuItem key={make.id} value={make.name}>
                            {make.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Condition Dropdown */}
            <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Condition</InputLabel>
                <Select
                    sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                    value={formState.conditionName}
                    onChange={(e) => handleInputChange('conditionName', e.target.value)}
                >
                    {/* Existing condition options */}
                    {conditionOptions.map((condition) => (
                        <MenuItem key={condition} value={condition}>
                            {condition}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Voltage, Capacity, and Price Text Fields */}
            <Box
                display="flex"
                justifyContent="space-between"
                sx={{ width: '90%', gap: '6rem' }}
            >
                <TextField
                    sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                    label="Voltage"
                    type="number"
                    value={formState.voltage}
                    onChange={(e) => handleInputChange('voltage', e.target.value)}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                />
                <TextField
                    sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                    label="Capacity"
                    type="number"
                    value={formState.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                />
                <TextField
                    sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                    label="Price"
                    type="number"
                    value={formState.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                />
            </Box>

            {/* Group Name Dropdown */}
            <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Group Name</InputLabel>
                <Select
                    sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                    value={formState.groupName}
                    onChange={(e) => handleInputChange('groupName', e.target.value)}
                >
                    {groupOptions.map((group) => (
                        <MenuItem key={group.id} value={group.groupName}>
                            {group.groupName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Length, Width, and Height Text Fields */}
            <Box
                display="flex"
                justifyContent="space-between"
                sx={{ width: '90%', gap: '6rem' }}
            >
                <TextField
                    sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                    label="Length"
                    type="number"
                    value={formState.length}
                    onChange={(e) => handleInputChange('length', e.target.value)}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                />
                <TextField
                    sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                    label="Width"
                    type="number"
                    value={formState.width}
                    onChange={(e) => handleInputChange('width', e.target.value)}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                />
                <TextField
                    sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                    label="Height"
                    type="number"
                    value={formState.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                />
            </Box>

            {/* Unit Type Dropdown */}
            <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Unit Type</InputLabel>
                <Select
                    sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                    value={formState.unitType}
                    onChange={(e) => handleInputChange('unitType', e.target.value)}
                >
                    {unitTypeOptions.map((unitType) => (
                        <MenuItem key={unitType.id} value={unitType.unitType}>
                            {unitType.unitType}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button
                sx={{ margin: '.5rem auto 0 auto' }}
                className='btn-primary'
                onClick={handleFormSubmit}
                variant="contained"
                color="primary"
                disabled={!isFormValid()}
            >
                Submit
            </Button>
            <Snackbar
                open={showSnackbar}
                autoHideDuration={2000}
                onClose={() => setShowSnackbar(false)}
            >
                <SnackbarContent
                    message='Asset edited successfully'
                    action={<CheckCircleOutline />}
                />
            </Snackbar>
        </Box>
    );
}