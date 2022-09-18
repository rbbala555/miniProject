import { Card, CardMedia, CardContent, Typography, MenuItem, Select, TextField, FormControl, InputLabel } from '@mui/material';
import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import "./Assets/style.scss";
import { httpRequest } from './Services/httpServices';
import { routePath } from './constants';
import screen from './Assets/images/screen.png';
import TablePagination from '@mui/material/TablePagination';

function App() {

  const [arrVal, setVal]        = useState<any>([]);
  const [year, setYear]         = useState<any>(); 
  const [searchVal, setSearch]  = useState<any>();
  const [listData, setList]     = useState<any>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const getData  = () => httpRequest.get(routePath.source).then(response => {
    console.log("data",response.data);
    setList(response.data);
    getDuplicate(response.data);
    }
  )

  var newArray:any = {};
  
  const getDuplicate = (value : any) => {
    
    const checkData = value.map((item:any) => {
      
      const noDuplicate = value.filter((x:any) => x.Title === item.Title && x.Year === item.Year && x.Type === item.Type).length;
      if(noDuplicate > 1){
        // if there are multiple occurences get the current index. If undefined take 1 as first copy index.    
        let currentIndex = newArray[item.Title] || 1;
          const newObj =  {
          name  : `${item.Title} (${currentIndex} of ${noDuplicate})`,
          year  : item.Year,
          genre : item.Type,
          Image : item.Poster
          }
          newArray[item.Title] = currentIndex+ 1;
          return newObj;
        }
        return item;
      })
      console.log("CheckData",checkData);
      sortData(checkData);
  }

  const sortData = (value : any) => {
    let sortedData:any ;
    sortedData = [...value].sort((a, b) => {
      return b.Year.localeCompare(a.Year);
    });
    console.log("sorted", sortedData);
    setVal(sortedData);
  }

  const sortClick = (value:any) => {
    setYear(value);
    let sortedData;
    if (value === '1') {
      sortedData = [...arrVal].sort((a, b) => {
        return b.Year.localeCompare(a.Year);
      });
    } else if (value === '2') {
      sortedData = [...arrVal].sort((a, b) => {
        return a.Year.localeCompare(b.Year);
      });
    }
    setVal(sortedData);
  }

  const searchData = (value:any) => {
    setSearch(value);
    if(searchVal === "" || searchVal === undefined){
      debugger;
      let arr = listData.filter((item: any) =>
      item?.Title.toLowerCase().includes(value));
      console.log('searchData', arr);
      setVal(arr);
    }
    else if(searchVal != value){
      debugger;
      let arr = listData.filter((item: any) =>
      item?.Title.toLowerCase().includes(value));
      console.log('searchData', arr);
      setVal(arr);
    }
    else{
      getData();
    }
    
  }

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    getData();
  },[]);

  return (
    <div className="App">
      <div className='container my-4'>
        <div className="col-md-12 col-sm-12 d-flex flex-wrap">
          <div className='col-md-12 col-sm-12 d-flex justify-content-between'>
            <div className='col-md-9 col-sm-8 text-center'>
              <TextField
                label = "Search"
                placeholder="Search By Title..."
                className="selectOpt"
                onChange = {(e:any)=>searchData(e.target.value)}
              />
            </div>
            <div className='col-md-3 col-sm-4 d-flex justify-content-between align-items-center'>
              <FormControl className="selectOpt">
                <InputLabel id='textField-Search-Label'>Sort By</InputLabel>
                <Select
                labelId='textField-Search-Label'
                label='sort by'
                variant='outlined'
                value={year}
                onChange={(e:any)=>sortClick(e.target.value)}
              >
                <MenuItem value='1'>Latest to Old</MenuItem>
                <MenuItem value='2'>Old to Latest</MenuItem>
              </Select>
              </FormControl>
              
            </div>
          </div>
          {arrVal.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((item:any, index:any) => {
            return(
              <div className="col-md-3 col-sm-12 p-3">
                <Card className='cardHeight'>
                  <div className='h-75'>
                    {item.Poster != 'N/A' &&
                      <img src={item.Poster} className='cardMedia' />
                    }
                    {item.Poster === 'N/A' &&
                      <img src={screen} className='cardMedia' />
                    }
                  </div>
                  <div className='p-2 h-25'>
                    <div style={{height:"65%", overflow:"auto"}} className='d-flex justify-content-between'>
                      <strong className='strong'>{item.Title}</strong>
                      <small className='ml-1 mt-2 small year'>{item.Year}</small>
                    </div>
                    <div style={{height:"35%"}}>
                      <span className='redBox p-1'>
                        <small className='text-capitalize small'>
                          {item.Type}
                        </small>
                      </span>
                      
                    </div>
                  </div>
                </Card>
              </div>
            )
          })
          }
        </div>
        <TablePagination
          component="div"
          className = 'pagination d-flex justify-content-end align-items-center'
          count={arrVal.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 20]}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
}

export default App;
