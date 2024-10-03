import { Input,FormControl,InputLabel} from '@mui/material';
import React from 'react';

function InputFields({value,id,name,func,inputlabel}) {
    return (
       
        <FormControl  sx={{mt:5,ml:5}} >
          <InputLabel htmlFor="client_name">{inputlabel}</InputLabel>
          <Input
            id={id}
            name={name}
            value={value}
            onChange={func}
          />
        </FormControl>
       
    );
}

export default InputFields;