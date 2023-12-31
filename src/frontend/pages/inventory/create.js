import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
    Typography,
    Box,
    IconButton,
    TextField,
    Button,
    Alert,
    MenuItem, Tab, Tabs, ToggleButtonGroup, ToggleButton, FormControl, InputLabel, Select
} from '@mui/material';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { Snackbar, SnackbarContent } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import axios from 'axios';

export default function Home() {

    const router = useRouter();
    const handleNavigation = (path) => {
        router.push(path);
    };

    const [isError, setIsError] = useState(null);
    const [showSnackbar, setShowSnackbar] = useState(false);

    // Const variables
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
        stampedSerial: ''
    });

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
            formState.unitType &&
            formState.stampedSerial
        );
    };


    // Dropdown options consts

    // Types
    const [typeOptions, setTypeOptions] = useState([]);
    const [showNewTypeField, setShowNewTypeField] = useState(false);

    // Models
    const [modelOptions, setModelOptions] = useState([]);
    const [showNewModelField, setShowNewModelField] = useState(false);

    // Makes
    const [makeOptions, setMakeOptions] = useState([]);
    const [showNewMakeField, setShowNewMakeField] = useState(false);

    // Conditions
    const [conditionOptions, setConditionOptions] = useState([
        'New',
        'Used',
        'Refurbished',
    ]);

    // Groups
    const [groupOptions, setGroupOptions] = useState([]);
    const [showNewGroupField, setShowNewGroupField] = useState(false);

    // Unit Types
    const [unitTypeOptions, setUnitTypeOptions] = useState([]);
    const [showNewUnitTypeField, setShowNewUnitTypeField] = useState(false);

    // Input change functions for tracking state across form entries
    const handleInputChange = (field, value) => {
        setFormState(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleTypeInputChange = (event) => {
        const value = event.target.value;

        if (value === 'Enter New Type') {
            setFormState((prevState) => ({
                ...prevState,
                typeName: '',
            }));
            setShowNewTypeField(true);
        } else {
            setFormState((prevState) => ({
                ...prevState,
                typeName: value,
            }));
            setShowNewTypeField(false);
        }
    };

    const handleModelInputChange = (event) => {
        const value = event.target.value;
        if (value === 'Enter New Model') {
            setFormState((prevState) => ({
                ...prevState,
                modelName: '',
            }));
            setShowNewModelField(true);
        } else {
            setFormState((prevState) => ({
                ...prevState,
                modelName: value,
            }));
            setShowNewModelField(false);
        }
    };

    const handleMakeInputChange = (event) => {
        const value = event.target.value;

        if (value === 'Enter New Make') {
            setFormState((prevState) => ({
                ...prevState,
                makeName: '',
            }));
            setShowNewMakeField(true);
        } else {
            setFormState((prevState) => ({
                ...prevState,
                makeName: value,
            }));
            setShowNewMakeField(false);
        }
    };

    const handleGroupInputChange = (event) => {
        const value = event.target.value;

        if (value === 'Enter New Group') {
            setFormState((prevState) => ({
                ...prevState,
                groupName: '',
            }));
            setShowNewGroupField(true);
        } else {
            setFormState((prevState) => ({
                ...prevState,
                groupName: value,
            }));
            setShowNewGroupField(false);
        }
    };

    const handleUnitTypeInputChange = (event) => {
        const value = event.target.value;

        if (value === 'Enter New Unit Type') {
            setFormState((prevState) => ({
                ...prevState,
                unitType: '',
            }));
            setShowNewUnitTypeField(true);
        } else {
            setFormState((prevState) => ({
                ...prevState,
                unitType: value,
            }));
            setShowNewUnitTypeField(false);
        }
    };


    // Form submit function
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        // Use the formState to make the API POST request...
        try {
            setIsError(null);
            await axios.post('http://localhost:7166/api/Batteries', formState)
                .then(response => {
                    setShowSnackbar(true);
                    setTimeout(() => {
                        setShowSnackbar(false);
                        router.push('/inventory');
                    }, 2000);
                    // Handle success if needed
                    console.log('Successfully created:', response.data);
                })
                .catch(error => {
                    // Handle error if needed
                    setIsError('Failed to create asset');
                    console.error('Error creating battery:', error);
                });

        } finally { console.log('Successfully created'); }
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
    }, []);




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
                    Create Asset
                </Typography>
                <Box display='flex' onClick={() => handleNavigation('/inventory')}>
                    <IconButton>
                        <ArrowCircleLeftIcon
                            sx={{ fontSize: '2.5rem', color: '#000000' }}
                        />
                    </IconButton>
                </Box>
            </Box>
            <Box sx={{
					display: 'flex',
					flexDirection: 'column',
					width: '100%',
					backgroundColor: '#fbfbfbf9',
					borderRadius: '8px',
					outline: '1px solid black',
					padding: '1rem',
					justifyContent: 'space-evenly',
					alignItems: 'center',
					margin: '1rem auto 0 auto',
				}}
			>
                <Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'left',
							margin: '0 auto',
							width: '100%',
							backgroundColor: '#fbfbfbf9',
							borderRight: '1px solid lightgray',
							borderLeft: '1px solid lightgray',
							borderBottom: '1px solid #ecececf9',
							borderTop: '1px solid #ecececf9',
							padding: '10px',
							borderRadius: '10px',
							height: '36rem',
						}}
					>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                    <Box sx={{ flex: '1', margin: '0 2rem'}}>
                        {/* Serial Number Input */}
                        <TextField
                            label="Serial Number"
                            value={formState.stampedSerial}
                            onChange={(e) => handleInputChange('stampedSerial', e.target.value)}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                        />

                        {/* Type Dropdown */}
                        <FormControl fullWidth variant="outlined" margin="normal">
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={showNewTypeField ? 'Enter New Type' : formState.typeName}
                                onChange={handleTypeInputChange}
                                sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                            >
                                {/* Input option for entering a new type */}
                                <MenuItem value="Enter New Type">
                                    <em>Enter New Type</em>
                                </MenuItem>
                                {/* Existing type options */}
                                {typeOptions.map((type) => (
                                    <MenuItem key={type.id} value={type.typeName}>
                                        {type.typeName}
                                    </MenuItem>
                                ))}
                            </Select>
                            {/* Input field for manually entering new type */}
                            {showNewTypeField && (
                                <TextField
                                    label="New Type"
                                    value={formState.typeName}
                                    onChange={(e) => handleInputChange('typeName', e.target.value)}
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                                />
                            )}
                        </FormControl>

                        {/* Model Dropdown */}
                        <FormControl fullWidth variant="outlined" margin="normal">
                            <InputLabel>Model</InputLabel>
                            <Select
                                value={showNewModelField ? 'Enter New Model' : formState.modelName}
                                onChange={handleModelInputChange}
                                sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                            >
                                {/* Input option for entering a new model */}
                                <MenuItem value="Enter New Model">
                                    <em>Enter New Model</em>
                                </MenuItem>
                                {/* Existing model options */}
                                {modelOptions.map((model) => (
                                    <MenuItem key={model.id} value={model.modelName}>
                                        {model.modelName}
                                    </MenuItem>
                                ))}
                            </Select>
                            {showNewModelField && (
                                <TextField
                                    sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                                    label="New Model"
                                    value={formState.modelName}
                                    onChange={(e) => handleInputChange('modelName', e.target.value)}
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                />
                            )}
                        </FormControl>


                        {/* Make Dropdown */}
                        <FormControl fullWidth variant="outlined" margin="normal">
                            <InputLabel>Make</InputLabel>
                            <Select
                                sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                                value={showNewMakeField ? 'Enter New Make' : formState.makeName}
                                onChange={handleMakeInputChange}
                            >
                                {/* Input option for entering a new make */}
                                <MenuItem value="Enter New Make">
                                    <em>Enter New Make</em>
                                </MenuItem>
                                {/* Existing make options */}
                                {makeOptions.map((make) => (
                                    <MenuItem key={make.id} value={make.name}>
                                        {make.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {/* Input field for manually entering new make */}
                            {showNewMakeField && (
                                <TextField
                                    sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                                    label="New Make"
                                    value={formState.makeName}
                                    onChange={(e) => handleInputChange('makeName', e.target.value)}
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                />
                            )}
                        </FormControl>
                    </Box>
                    <Box sx={{ flex: '1', margin: '0 2rem'}}>
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
                            sx={{ width: '100%', gap: '3rem' }}
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
                                value={showNewGroupField ? 'Enter New Group' : formState.groupName}
                                onChange={handleGroupInputChange}
                            >

                                <MenuItem value="Enter New Group">
                                    <em>Enter New Group</em>
                                </MenuItem>

                                {groupOptions.map((group) => (
                                    <MenuItem key={group.id} value={group.groupName}>
                                        {group.groupName}
                                    </MenuItem>
                                ))}
                            </Select>



                            {showNewGroupField && (
                                <TextField
                                    sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                                    label="New Group"
                                    value={formState.groupName}
                                    onChange={(e) => handleInputChange('groupName', e.target.value)}
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                />
                            )}</FormControl>

                        {/* Length, Width, and Height Text Fields */}
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            sx={{ width: '100%', gap: '3rem' }}
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

                        <FormControl fullWidth variant="outlined" margin="normal">
                            <InputLabel>Unit Type</InputLabel>
                            <Select
                                sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                                value={showNewUnitTypeField ? 'Enter New Unit Type' : formState.unitType}
                                onChange={handleUnitTypeInputChange}
                            >
                                <MenuItem value="Enter New Unit Type">
                                    <em>Enter New Unit Type</em>
                                </MenuItem>
                                {unitTypeOptions.map((unitType) => (
                                    <MenuItem key={unitType.id} value={unitType.unitType}>
                                        {unitType.unitType}
                                    </MenuItem>
                                ))}
                            </Select>
                            {showNewUnitTypeField && (
                                <TextField
                                    sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                                    label="New Unit Type"
                                    value={formState.unitType}
                                    onChange={(e) => handleInputChange('unitType', e.target.value)}
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                />
                            )}
                        </FormControl>
                    </Box>
                </Box>
                </Box>

                <Button
                    sx={{ margin: '1rem auto 0 auto' }}
                    className='btn-primary'
                    onClick={handleFormSubmit}
                    variant="contained"
                    color="primary"
                    disabled={!isFormValid()}
                >
                    Create
                </Button>
                <Snackbar
                    open={showSnackbar}
                    autoHideDuration={2000}
                    onClose={() => setShowSnackbar(false)} // Close on click away
                >
                    <SnackbarContent
                        message='Asset created successfully'
                        action={<CheckCircleOutline />}
                    />
                </Snackbar>
            </Box>
        </Box>
    );
}