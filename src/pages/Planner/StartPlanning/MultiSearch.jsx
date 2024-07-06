import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const MultiSearch = ({label, searchFields, setSearchFields}) => {

  const handleChange = (index, event) => {
    const values = [...searchFields];
    values[index].value = event.target.value;
    setSearchFields(values);
  };

  const handleAddField = () => {
    const values = [...searchFields];
    values.push({ value: '' });
    setSearchFields(values);
  };

  const handleRemoveField = (index) => {
    const values = [...searchFields];
    values.splice(index, 1);
    setSearchFields(values);
  };

  return (
    <Box flex={1} minWidth={"300px"}>
      {searchFields.map((searchField, index) => (
        
        <>
        <Typography>{label}</Typography>
        <Box key={index} display="flex" alignItems="center" mb={2}>
        
          <TextField
            value={searchField.value}
            onChange={(event) => handleChange(index, event)}
            variant="outlined"
            
            
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleRemoveField(index)}
            size='small'
            sx = {{marginLeft:2}} 
            disabled={[...searchFields].length === 1}
          >
            Remove 
          </Button>
        </Box>
        </>
      ))}
      <Button variant="contained" color="primary" size='small' onClick={handleAddField}>
        Add Field
      </Button>
    </Box>
  );
};

export default MultiSearch;
