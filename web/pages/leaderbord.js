import { useEffect, useState } from 'react'
import Loading from '../components/Loading';
import Table from '../components/Table';



const Leaderbord = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

useEffect(async () => {
    console.log('GETTING SOME DATA');
    // get and add current statistics values
    data = await getNFTStatistics();

    setData(data);
    setLoading(false);
}, []);

const getNFTStatistics = async() => {
    
    const response = await fetch('/api/getNFTStatistics', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
    });

    const res = await response.json();
    return res;

  }


  return (<>
    {loading ? <Loading/> : <Table data={data}></Table>}  
    </>
  )
}

export default Leaderbord
