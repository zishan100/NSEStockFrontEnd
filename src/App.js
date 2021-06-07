import React,{useState,useEffect} from "react";

import { AppBar, Paper, Table, TableCell, TableBody, TableContainer, TableHead, TablePagination, TableRow, Typography, Container, TextField } from '@material-ui/core/'

import { makeStyles } from '@material-ui/core/styles';

import "./App.css";
import axios from 'axios';

const columns = [
  { id: "SYMBOL", label: "SYMBOL", minWidth: 120 },
  { id: "SERIES", label: "SERIES", minWidth: 70 },
  {
    id: "OPEN",
    label: "OPEN",
    minWidth: 130,
    align: "right",
    format: (value) => value.toLocaleString("en-US")
  },
  {
    id: "HIGH",
    label: "HIGH",
    minWidth: 120,
    align: "right",
    format: (value) => value.toLocaleString("en-US")
  },
  {
    id: "CLOSE",
    label: "CLOSE",
    minWidth: 120,
    align: "right",
    format: (value) => value.toFixed(2)
  },
   {
    id: "ISIN",
    label: "ISIN",
    minWidth: 100,
    align: "right",
    format: (value) => value.toFixed(2)
  }

];


const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  container: {
    maxHeight: 640
  }
});


const App =()=> {
   let classes = useStyles();
   const [page, setPage] = React.useState(0);
   const [rowsPerPage, setRowsPerPage] = React.useState(8);
   
  const [nselist, Setnselist] = useState([]);
  
  const [searchlist, Setsearchlist] = useState([]);
  
  useEffect(() => {
         
    axios.get('http://localhost:5000/')
      .then(response => {
        const { data: { nse } } = response;
       
        Setsearchlist(nse);
        Setnselist(nse);
        
      }).catch(err => {
        console.log(err);
      });
          
        
       
  }, []);
         
  
  
     
  
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

   const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };  
   
  const SerachBySymbol = (e) => {
    let search = e.target.value;
    let newnse = nselist.filter(nse => {
        return  nse.SYMBOL.includes(search.trim().toUpperCase())
      })  
             
    Setsearchlist(newnse);
      
  }  


  return (
    <div  className='main-container'>
      <Container maxWidth='xl' >
        <AppBar position='fixed' >
          <Typography  variant="h5" gutterBottom >
           NSE STOCKS LIST
         </Typography>      
          
         <div className='search-input' >
          <TextField variant='outlined' color='primary' type='search'
            placeholder='search by symbol....'
            onChange={ (e) => {
              SerachBySymbol(e);
                       
            }} 
          />
          
      </div>
  
        </AppBar>
      
              
     <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {searchlist.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row,i) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                    {
                     columns.map((column) => {
                      
                      
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })
                    }
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
     <TablePagination
        rowsPerPageOptions={[10,20,30]}
        component="div"
        count={nselist.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper> 
        
      </Container>
    </div>
    );
  
}

export default App;
