import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
    Typography,
    Box,
    IconButton,
    TextField,
    Button,
    Alert,
    MenuItem, Tab, Tabs, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { Snackbar, SnackbarContent } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import axios from 'axios';

export default function Home() {
    const [activeTab, setActiveTab] = useState(0); // Default to the first tab
    const [serialNumber, setSerialNumber] = useState('');
    const [isNewBattery, setIsNewBattery] = useState(false);
    const [batteryOption, setBatteryOption] = useState('');
    const [isNewModel, setIsNewModel] = useState(false);
    const [modelOption, setModelOption] = useState('');
    const [modelName, setModelName] = useState('');
    const [isNewType, setIsNewType] = useState(false);
    const [typeOption, setTypeOption] = useState('');
    const [typeName, setTypeName] = useState('');
    const [isNewMake, setIsNewMake] = useState(false);
    const [makeOptions, setMakeOptions] = useState([]);
    const [makeName, setMakeName] = useState('');
    const [isNewCondition, setIsNewCondition] = useState(false);
    const [conditionText, setConditionText] = useState('');
    const [conditionOption, setConditionOption] = useState('');
    const [voltage, setVoltage] = useState('');
    const [capacity, setCapacity] = useState('');
    const [price, setPrice] = useState('');
    const [isNewGroup, setIsNewGroup] = useState(false);
    const [groupOption, setGroupOption] = useState('');
    const [groupName, setGroupName] = useState('');
    const [groupLength, setGroupLength] = useState('');
    const [groupHeight, setGroupHeight] = useState('');
    const [groupWidth, setGroupWidth] = useState('');
    const [isNewUnit, setIsNewUnit] = useState(false);
    const [unitName, setUnitName] = useState('');
    const [unitOption, setUnitOption] = useState('');


    const [detailedBatteryInfo, setDetailedBatteryInfo] = useState(null);


    const tabs = [
        { label: 'Serial Number' },
        { label: 'Battery Make' },
        { label: 'Model' },
        { label: 'Type' },
        { label: 'Condition' },
        { label: 'Details' },
        { label: 'Group' },
        { label: 'Unit' },
        { label: 'Create Summary' },
    ];

    const dummyGroupOptions = [
        { value: 'group1', label: 'Group 1' },
        { value: 'group2', label: 'Group 2' },
        // ... Add more options as needed ...
    ];

    const handleNextTab = async () => {
        if (isNewBattery && makeName) {
            // If user entered a new battery make name, move to the next tab directly
            setActiveTab(activeTab + 1);
            return;
        }
        
        else if (activeTab === 1 && batteryOption) {
            try {
                const selectedMake = makeOptions.find(option => option.id === batteryOption);
                const response = await axios.get(`http://localhost:7166/api/Batteries?id=${selectedMake.id}`);
                const selectedBattery = response.data[0]; // Assuming you get only one matching battery
                setTypeName(selectedBattery.typeName);
                setModelName(selectedBattery.modelName);
                setMakeName(selectedBattery.makeName);
                setConditionText(selectedBattery.conditionName);
                setVoltage(selectedBattery.voltage);
                setCapacity(selectedBattery.capacity);
                setPrice(selectedBattery.price);
                setGroupName(selectedBattery.groupName);
                setGroupLength(selectedBattery.length);
                setGroupHeight(selectedBattery.height);
                setGroupWidth(selectedBattery.width);
                setUnitOption(selectedBattery.unitType);
                setSerialNumber(serialNumber);
            } catch (error) {
                // Handle error if fetching data fails
                console.error('Error fetching battery data:', error);
                return;
            }
            setActiveTab(8); // Move to the Review and Confirm tab directly
        } else if (activeTab < tabs.length - 1) {
            setActiveTab(activeTab + 1);
        }
    };

    const handlePreviousTab = () => {
        setActiveTab(activeTab - 1);
    };

    useEffect(() => {
        // Fetch data for battery dropdown
        axios
            .get('http://localhost:7166/api/Batteries')
            .then((response) => {
                setBatteryOption(response.data);
            })
            .catch((error) => {
                console.error('Error fetching type options:', error);
            });
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
                console.error('Error fetching type options:', error);
            });

        // Fetch data for battery make dropdown
        axios
            .get('http://localhost:7166/api/BatteryMakes')
            .then((response) => {
                setMakeOptions(response.data);
            })
            .catch((error) => {
                console.error('Error fetching type options:', error);
            });

        // Fetch data for battery group dropdown
        axios
            .get('http://localhost:7166/api/BatteryGroups')
            .then((response) => {
                setGroupOptions(response.data);
            })
            .catch((error) => {
                console.error('Error fetching type options:', error);
            });
    }, []);

    useEffect(() => {
        // Fetch the detailed battery information based on the selected makeName
        if (makeName) {
            // Fetch detailed battery information using the provided endpoint
            axios.get(`http://localhost:7166/api/Batteries?makeName=${makeName}`)
                .then(response => {
                    if (response.data.length > 0) {
                        setDetailedBatteryInfo(response.data[0]);
                    }
                })
                .catch(error => {
                    console.error('Error fetching detailed battery info:', error);
                });
        }
    }, [makeName]);

    return (
        <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            sx={{
                backgroundColor: '#E6E8E7',
                borderRadius: '8px',
                margin: '.5rem auto',
                padding: '.5rem 1rem',
                height: '80vh',
                overflow: 'auto',
            }}
        >
            {/* Page Heading & Back Button */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                }}
            >

                <Typography variant='h3' align='center' component='h2'>
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

            <Tabs value={activeTab} sx={{ width: '100%' }}>
                {tabs.map((tab, index) => {
                    if (index <= activeTab) {
                        return (
                            <Tab
                                key={index}
                                label={tab.label}
                                onClick={() => setActiveTab(index)}
                            />
                        );
                    }
                    return null;
                })}
            </Tabs>

            {activeTab === 0 && (
                <Box
                    component='form'
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleNextTab();
                    }}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '80%',
                        backgroundColor: '#fbfbfbf9',
                        borderRadius: '8px',
                        outline: '1px solid black',
                        padding: '2rem',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '2rem',
                            width: '100%',
                        }}
                    >
                        <Box>
                            <Typography variant='h6'>Stamped Serial</Typography>
                            <TextField
                                input
                                id='serialNumber'
                                name='serialNumber'
                                label='Enter stamped serial no.'
                                variant='outlined'
                                fullWidth
                                value={serialNumber}
                                onChange={(e) => setSerialNumber(e.target.value)}
                            />
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                mt: 2,
                            }}
                        >
                            <Button
                                variant='contained'
                                color='primary'
                                type='submit'
                                disabled={!serialNumber} // Disable when serialNumber is empty
                            >
                                Next
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}
            {activeTab === 1 && (
    <Box>
        <Typography variant='h6'>New Battery</Typography>
        <ToggleButtonGroup
            value={isNewBattery}
            exclusive
            onChange={() => setIsNewBattery(!isNewBattery)}
        >
            <ToggleButton value={true} variant='contained' color='primary'>
                Yes
            </ToggleButton>
            <ToggleButton value={false} variant='contained' color='primary'>
                No
            </ToggleButton>
        </ToggleButtonGroup>

        {isNewBattery ? (
            <Box sx={{ mt: 2 }}>
                <TextField
                    label='Battery Make Name'
                    variant='outlined'
                    fullWidth
                    value={makeName}
                    onChange={(e) => setMakeName(e.target.value)}
                />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 2,
                    }}
                >
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={handlePreviousTab}
                        disabled={activeTab === 0}
                    >
                        Previous
                    </Button>
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={handleNextTab}
                    >
                        Next
                    </Button>
                </Box>
            </Box>
        ) : (
            <Box sx={{ mt: 2 }}>
                <TextField
                    select
                    label='Select Battery Make'
                    variant='outlined'
                    fullWidth
                    value={batteryOption}
                    onChange={(e) => {
                        const selectedMakeOption = makeOptions.find(option => option.id === e.target.value);
                        if (selectedMakeOption) {
                            setMakeName(selectedMakeOption.name); // Update makeName based on selected option
                            setBatteryOption(e.target.value);
                        }
                    }}
                >
                    {makeOptions.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.name}
                        </MenuItem>
                    ))}
                </TextField>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 2,
                    }}
                >
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={handlePreviousTab}
                        disabled={activeTab === 0}
                    >
                        Previous
                    </Button>
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={handleNextTab}
                        disabled={!batteryOption}
                    >
                        Next
                    </Button>
                </Box>
            </Box>
        )}
    </Box>
)}
            {/* Add content for other tabs here */}
            {activeTab === 2 && (
                <Box
                // ... (Similar styling as previous tab)
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '2rem',
                            width: '100%',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant='h6'>New Model</Typography>
                            <ToggleButtonGroup
                                value={isNewModel}
                                exclusive
                                onChange={() => setIsNewModel(!isNewModel)}
                            >
                                <ToggleButton value={true} variant='contained' color='primary'>
                                    Yes
                                </ToggleButton>
                                <ToggleButton value={false} variant='contained' color='primary'>
                                    No
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                        {isNewModel ? (
                            <Box sx={{ mt: 2 }}>
                                <TextField
                                    label='Model Name'
                                    variant='outlined'
                                    fullWidth
                                    value={modelName}
                                    onChange={(e) => setModelName(e.target.value)}
                                />
                            </Box>
                        ) : (
                            <Box sx={{ mt: 2 }}>
                                <TextField
                                    select
                                    label='Select Model'
                                    variant='outlined'
                                    fullWidth
                                    value={modelOption}
                                    onChange={(e) => setModelOption(e.target.value)}
                                >
                                    {/* Populate options from API */}
                                    <MenuItem value='option1'>Option 1</MenuItem>
                                    <MenuItem value='option2'>Option 2</MenuItem>
                                    {/* Add more options */}
                                </TextField>
                            </Box>
                        )}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mt: 2,
                            }}
                        >
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={handlePreviousTab}
                                disabled={activeTab === 0}
                            >
                                Previous
                            </Button>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={handleNextTab}
                                disabled={
                                    activeTab === 0 ||
                                    (isNewModel && !modelName) ||    // Disable when new model selected but no name
                                    (!isNewModel && !modelOption)    // Disable when existing model selected but no option
                                }
                            >
                                Next
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}
            {activeTab === 3 && (
                <Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '2rem',
                            width: '100%',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant='h6'>New Type</Typography>
                            <ToggleButtonGroup
                                value={isNewType}
                                exclusive
                                onChange={() => setIsNewType(!isNewType)}
                            >
                                <ToggleButton value={true} variant='contained' color='primary'>
                                    Yes
                                </ToggleButton>
                                <ToggleButton value={false} variant='contained' color='primary'>
                                    No
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                        {isNewType ? (
                            <Box sx={{ mt: 2 }}>
                                <TextField
                                    label='Type Name'
                                    variant='outlined'
                                    fullWidth
                                    value={typeName}
                                    onChange={(e) => setTypeName(e.target.value)}
                                />
                            </Box>
                        ) : (
                            <Box sx={{ mt: 2 }}>
                                <TextField
                                    select
                                    label='Select Type'
                                    variant='outlined'
                                    fullWidth
                                    value={typeOption}
                                    onChange={(e) => setTypeOption(e.target.value)}
                                >
                                    {/* Populate options from API */}
                                    <MenuItem value='type1'>Type 1</MenuItem>
                                    <MenuItem value='type2'>Type 2</MenuItem>
                                    {/* Add more options */}
                                </TextField>
                            </Box>
                        )}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mt: 2,
                            }}
                        >
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={handlePreviousTab}
                                disabled={activeTab === 0}
                            >
                                Previous
                            </Button>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={handleNextTab}
                                disabled={
                                    activeTab === 0 ||
                                    (isNewType && !typeName) ||
                                    (!isNewType && !typeOption)
                                }
                            >
                                Next
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}
            {activeTab === 4 && (
                <Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '2rem',
                            width: '100%',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant='h6'>Condition</Typography>
                            <ToggleButtonGroup
                                value={isNewCondition}
                                exclusive
                                onChange={() => setIsNewCondition(!isNewCondition)}
                            >
                                <ToggleButton value={true} variant='contained' color='primary'>
                                    Yes
                                </ToggleButton>
                                <ToggleButton value={false} variant='contained' color='primary'>
                                    No
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                        {isNewCondition ? (
                            <Box sx={{ mt: 2 }}>
                                <TextField
                                    label='Condition Text'
                                    variant='outlined'
                                    fullWidth
                                    value={conditionText}
                                    onChange={(e) => setConditionText(e.target.value)}
                                />
                            </Box>
                        ) : (
                            <Box sx={{ mt: 2 }}>
                                <TextField
                                    select
                                    label='Select Condition'
                                    variant='outlined'
                                    fullWidth
                                    value={conditionOption}
                                    onChange={(e) => setConditionOption(e.target.value)}
                                >
                                    {/* Populate options from API */}
                                    <MenuItem value='condition1'>Condition 1</MenuItem>
                                    <MenuItem value='condition2'>Condition 2</MenuItem>
                                    {/* Add more options */}
                                </TextField>
                            </Box>
                        )}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mt: 2,
                            }}
                        >
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={handlePreviousTab}
                                disabled={activeTab === 0}
                            >
                                Previous
                            </Button>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={handleNextTab}
                                disabled={
                                    activeTab === 0 ||
                                    (isNewCondition && !conditionText) ||
                                    (!isNewCondition && !conditionOption)
                                }
                            >
                                Next
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}
            {activeTab === 5 && (
                <Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '2rem',
                            width: '100%',
                        }}
                    >
                        <TextField
                            label='Voltage'
                            variant='outlined'
                            fullWidth
                            value={voltage}
                            onChange={(e) => setVoltage(e.target.value)}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            label='Capacity'
                            variant='outlined'
                            fullWidth
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            label='Price'
                            variant='outlined'
                            fullWidth
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            sx={{ mt: 2 }}
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mt: 2,
                            }}
                        >
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={handlePreviousTab}
                                disabled={activeTab === 0}
                            >
                                Previous
                            </Button>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={handleNextTab}
                                disabled={
                                    activeTab === 0 ||
                                    !voltage ||
                                    !capacity ||
                                    !price
                                }
                            >
                                Next
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}
            {activeTab === 6 && (
                <Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '2rem',
                            width: '100%',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant='h6'>New Group</Typography>
                            <ToggleButtonGroup
                                value={isNewGroup}
                                exclusive
                                onChange={() => setIsNewGroup(!isNewGroup)}
                            >
                                <ToggleButton value={true} variant='contained' color='primary'>
                                    Yes
                                </ToggleButton>
                                <ToggleButton value={false} variant='contained' color='primary'>
                                    No
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                        {isNewGroup ? (
                            <Box sx={{ mt: 2 }}>
                                <TextField
                                    label='Group Name'
                                    variant='outlined'
                                    fullWidth
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                />
                                <TextField
                                    label='Length'
                                    variant='outlined'
                                    fullWidth
                                    value={groupLength}
                                    onChange={(e) => setGroupLength(e.target.value)}
                                    sx={{ mt: 2 }}
                                />
                                <TextField
                                    label='Height'
                                    variant='outlined'
                                    fullWidth
                                    value={groupHeight}
                                    onChange={(e) => setGroupHeight(e.target.value)}
                                    sx={{ mt: 2 }}
                                />
                                <TextField
                                    label='Width'
                                    variant='outlined'
                                    fullWidth
                                    value={groupWidth}
                                    onChange={(e) => setGroupWidth(e.target.value)}
                                    sx={{ mt: 2 }}
                                />
                            </Box>
                        ) : (
                            <Box sx={{ mt: 2 }}>
                                <TextField
                                    select
                                    label='Group Name'
                                    variant='outlined'
                                    fullWidth
                                    value={groupOption}
                                    onChange={(e) => setGroupOption(e.target.value)}
                                >
                                    {dummyGroupOptions.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                {groupOption === 'group1' && (
                                    <Box>
                                        <TextField
                                            label='Length'
                                            variant='outlined'
                                            fullWidth
                                            value='100' // Example dummy data
                                            readOnly
                                            sx={{ mt: 2 }}
                                        />
                                        <TextField
                                            label='Height'
                                            variant='outlined'
                                            fullWidth
                                            value='50' // Example dummy data
                                            readOnly
                                            sx={{ mt: 2 }}
                                        />
                                        <TextField
                                            label='Width'
                                            variant='outlined'
                                            fullWidth
                                            value='30' // Example dummy data
                                            readOnly
                                            sx={{ mt: 2 }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        )}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mt: 2,
                            }}
                        >
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={handlePreviousTab}
                                disabled={activeTab === 0}
                            >
                                Previous
                            </Button>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={handleNextTab}
                                disabled={
                                    activeTab === 0 ||
                                    (isNewGroup && (!groupName || !groupLength || !groupHeight || !groupWidth)) ||
                                    (!isNewGroup && !groupOption)
                                }
                            >
                                Next
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}
            {activeTab === 7 && (
                <Box>
                    <Typography variant='h6'>New Unit</Typography>
                    <ToggleButtonGroup
                        value={isNewUnit}
                        exclusive
                        onChange={() => setIsNewUnit(!isNewUnit)}
                    >
                        <ToggleButton value={true} variant='contained' color='primary'>
                            Yes
                        </ToggleButton>
                        <ToggleButton value={false} variant='contained' color='primary'>
                            No
                        </ToggleButton>
                    </ToggleButtonGroup>

                    {isNewUnit ? (
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                label='Unit Name'
                                variant='outlined'
                                fullWidth
                                value={unitName}
                                onChange={(e) => setUnitName(e.target.value)}
                            />
                        </Box>
                    ) : (
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                select
                                label='Select Unit'
                                variant='outlined'
                                fullWidth
                                value={unitOption}
                                onChange={(e) => setUnitOption(e.target.value)}
                            >
                                {/* Populate options from API */}
                                <MenuItem value='unit1'>Unit 1</MenuItem>
                                <MenuItem value='unit2'>Unit 2</MenuItem>
                                {/* Add more options */}
                            </TextField>
                        </Box>
                    )}

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mt: 2,
                        }}
                    >
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={handlePreviousTab}
                            disabled={activeTab === 0}
                        >
                            Previous
                        </Button>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={handleNextTab}
                            disabled={
                                (isNewUnit && !unitName) ||    // Disable when new unit selected but no name
                                (!isNewUnit && !unitOption)    // Disable when existing unit selected but no option
                            }
                        >
                            Next
                        </Button>
                    </Box>
                </Box>
            )}
            {activeTab === 8 && detailedBatteryInfo && (
                <Box>
                    <Typography variant='h6'>Review and Confirm</Typography>

                    <Typography>Type Name: {detailedBatteryInfo.typeName}</Typography>
                    <Typography>Model Name: {detailedBatteryInfo.modelName}</Typography>
                    <Typography>Make Name: {detailedBatteryInfo.makeName}</Typography>
                    <Typography>Condition Name: {detailedBatteryInfo.conditionName}</Typography>
                    <Typography>Voltage: {detailedBatteryInfo.voltage}</Typography>
                    <Typography>Capacity: {detailedBatteryInfo.capacity}</Typography>
                    <Typography>Price: {detailedBatteryInfo.price}</Typography>
                    <Typography>Group Name: {detailedBatteryInfo.groupName}</Typography>
                    <Typography>Length: {detailedBatteryInfo.length}</Typography>
                    <Typography>Width: {detailedBatteryInfo.width}</Typography>
                    <Typography>Height: {detailedBatteryInfo.height}</Typography>
                    <Typography>Unit Type: {detailedBatteryInfo.unitType}</Typography>
                    <Typography>Stamped Serial: {serialNumber}</Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mt: 2,
                        }}
                    >
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={handlePreviousTab}
                            disabled={activeTab === 0}
                        >
                            Previous
                        </Button>
                        <Button
                            variant='contained'
                            color='primary'
                            className='btn-primary'
                            // onClick={handleSubmit}
                            // Add conditions to enable/disable Create based on inputs
                            // Disabled condition based on your requirements
                            disabled={!detailedBatteryInfo}
                        >
                            Create
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
}