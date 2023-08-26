import { useState } from 'react';
import { Typography, Box, TextField, Button, Tab, Tabs, MenuItem, ToggleButtonGroup, ToggleButton } from '@mui/material';

export default function Home() {
    const [activeTab, setActiveTab] = useState(0); // Default to the first tab
    const [serialNumber, setSerialNumber] = useState('');
    const [isNewModel, setIsNewModel] = useState(false);
    const [modelOption, setModelOption] = useState('');
    const [modelName, setModelName] = useState('');
    const [isNewType, setIsNewType] = useState(false);
    const [typeOption, setTypeOption] = useState('');
    const [typeName, setTypeName] = useState('');
    const [isNewMake, setIsNewMake] = useState(false);
    const [makeOption, setMakeOption] = useState('');
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

    const dummyGroupOptions = [
        { value: 'group1', label: 'Group 1' },
        { value: 'group2', label: 'Group 2' },
        // ... Add more options as needed ...
    ];

    const handleNextTab = () => {
        setActiveTab(activeTab + 1);
    };

    const handlePreviousTab = () => {
        setActiveTab(activeTab - 1);
    };

    const handleSubmit = () => {
        // Gather data from all tabs
        const formData = {
            serialNumber,
            isNewModel,
            modelName,
            modelOption,
            // ... (gather data from other tabs similarly)
            isNewUnit,
            unitName,
            unitOption,
        };

        // Send the formData to your backend or perform necessary actions
        // For example, you can use fetch or axios to make an API call

        console.log(formData); // Just for demonstration
    };

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
            {/* Page Heading */}
            <Typography variant='h3' align='center' component='h2'>
                Create Battery
            </Typography>

            <Tabs value={activeTab} sx={{ width: '100%' }}>
                <Tab label='Serial Number' />
                <Tab label='Model' disabled />
                <Tab label='Type' disabled />
                <Tab label='Make' disabled />
                <Tab label='Condition' disabled />
                <Tab label='Details' disabled />
                <Tab label='Group' disabled />
                <Tab label='Unit' disabled />
                <Tab label='Create Summary' disabled />
                {/* Add more tabs as needed */}
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
                                id='stampedSerial'
                                name='stampedSerial'
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

            {/* Add content for other tabs here */}
            {activeTab === 1 && (
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
            {activeTab === 2 && (
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
                            <Typography variant='h6'>New Make</Typography>
                            <ToggleButtonGroup
                                value={isNewMake}
                                exclusive
                                onChange={() => setIsNewMake(!isNewMake)}
                            >
                                <ToggleButton value={true} variant='contained' color='primary'>
                                    Yes
                                </ToggleButton>
                                <ToggleButton value={false} variant='contained' color='primary'>
                                    No
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                        {isNewMake ? (
                            <Box sx={{ mt: 2 }}>
                                <TextField
                                    label='Make Name'
                                    variant='outlined'
                                    fullWidth
                                    value={makeName}
                                    onChange={(e) => setMakeName(e.target.value)}
                                />
                            </Box>
                        ) : (
                            <Box sx={{ mt: 2 }}>
                                <TextField
                                    select
                                    label='Select Make'
                                    variant='outlined'
                                    fullWidth
                                    value={makeOption}
                                    onChange={(e) => setMakeOption(e.target.value)}
                                >
                                    {/* Populate options from API */}
                                    <MenuItem value='make1'>Make 1</MenuItem>
                                    <MenuItem value='make2'>Make 2</MenuItem>
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
                                    (isNewMake && !makeName) ||
                                    (!isNewMake && !makeOption)
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
{activeTab === 8 && (
    <Box>
        <Typography variant='h6'>Review and Confirm</Typography>

        <Typography>Serial Number: {serialNumber}</Typography>
        <Typography>Selected Model: {modelOption}</Typography>
        <Typography>Type Name: {typeName || typeOption}</Typography>
        <Typography>Selected Make: {makeOption}</Typography>
        <Typography>Condition: {conditionText || conditionOption}</Typography>
        <Typography>Voltage: {voltage}</Typography>
        <Typography>Capacity: {capacity}</Typography>
        <Typography>Price: {price}</Typography>
        <Typography>Selected Group: {groupName || groupOption}</Typography>
        {isNewGroup ? (
            <Box>
                <Typography>Length: {groupLength}</Typography>
                <Typography>Height: {groupHeight}</Typography>
                <Typography>Width: {groupWidth}</Typography>
            </Box>
        ) : (
            groupOption === 'group1' && (
                <Box>
                    <Typography>Length: {groupLength || 'Length data from API'}</Typography>
                    <Typography>Height: {groupHeight || 'Height data from API'}</Typography>
                    <Typography>Width: {groupWidth || 'Width data from API'}</Typography>
                </Box>
            )
        )}
        <Typography>Selected Unit: {unitOption}</Typography>

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
            >
                Create
            </Button>
        </Box>
    </Box>
)}
        </Box>
    );
}