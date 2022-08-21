import React from 'react'

const BudgetItem = ({excelData, setExcelData}) => {
    return (
        <Item key={index}>
            <Typography key="costCode" sx={{fontWeight: 'bold'}}>{row.costCode}</Typography>
            <Typography key="quantityBudget">{row.quantityBudget}</Typography>
            <Typography key="laborSpeed">{row.laborSpeed} {row.uom}</Typography>
            <TextField 
                id={row.costCode} 
                key="todaysQuantity" 
                name='todaysQuantity' 
                // max={parseInt(row.quantityBudget)} 
                error={row.isErrorTodaysQty ? true : false}
                onChange={e => handleChange(e)}
                defaultValue={row.todaysQuantity}
                helperText={row.isErrorTodaysQty ? row.errorTextTodaysQty : ''}
                variant="standard"
            />
            
            <Typography key="hoursNeeded">{Math.round((row.todaysQuantity / row.laborSpeed) * 100)/100}</Typography>
            <Typography key="manDays">{(Math.round((row.todaysQuantity / row.laborSpeed) * 100)/100) / row.laborHoursInDay}</Typography>
            
                {/* <TextField 
                id={row.costCode}
                key="crewSize" 
                error={row.isErrorCrewSize ? true : false}
                name='crewSize' 
                onChange={e => handleChange(e)} 
                defaultValue={row.crewSize}
                helperText={row.isErrorCrewSize ? row.errorTextCrewSize : ''}
                variant="standard"
                /> */}
            
            <Typography key="daysOfWork">{row.isErrorCrewSize ? 'Error' : (Math.round((row.todaysQuantity / row.laborSpeed) * 100)/100) / row.laborHoursInDay / row.crewSize}</Typography>
            <Button variant="contained">Measure</Button>
            </Item>
    )
}

export default BudgetItem
