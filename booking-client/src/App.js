import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
  useParams
} from "react-router-dom";
import {useState, useEffect} from 'react'


const newDate = ()=>{
  let date = new Date()
  return date.toISOString().split('T')[0]
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookingApp/>}>
          <Route index element={<Home/>}/>
          <Route path="flights" element={<Flights/>}/>
          <Route path="flight/:flightId" element={<Flight/>}/> 
          <Route path="register" element={<Register/>}/>
        </Route>
      </Routes>
    </Router>
  )
}

const BookingApp = ()=>{
  return(
    <div className="h-screen flex flex-col gap-4">
      <header>
        <nav className="bg-blue-900 w-screen py-4 px-8">
            <ul className="flex">
             <li className="mr-6">
                <Link to="/" className="text-white font-semibold hover:text-gray-200 inline-flex">
                  Inicio
                </Link>
              </li>
              <li className="mr-6">
                <Link to="flights" className="text-white font-semibold hover:text-gray-200 inline-flex">
                  Vuelos
                </Link>
              </li>
              <li className="mr-6">
                <Link to="register" className="text-white font-semibold hover:text-gray-200 infline-flex">
                  Registro
                </Link>
              </li>
            </ul>
          </nav>
      </header>
      <Outlet/>
    </div>
  )
}


const Home = ()=>{
  return (
    <main className="flex flex-col items-center gap-12">
      <h1 className="font-semibold text-gray-900 text-4xl mt-8">Agencia de vuelos - DBA</h1>
      <img src="booking.png" className="h-64 w-64" alt="logo" />
      <Link to="flights" className="bg-blue-900 text-white px-6 py-2 hover:bg-blue-800 cursor-pointer rounded-md">
        Reservar
      </Link>
    </main>
  )
}

const Flights = ()=>{
  const [flightsState, setFlightsState] = useState({flights:[],
  loadingFlights:false})
  let [currentPage, setCurrentPage] = useState(1)

  const getFlights = ()=>{
    setFlightsState({...flightsState,loadingFlights:true})
    fetch('http://localhost:5000/flight/')
    .then(response => response.json())
    .then(data => setFlightsState({...flightsState,flights:data.flights,loadingFlights:false}));
  }
  useEffect(() => {
    getFlights()
  },[]);

  
  let pageRange = ()=>{
    let startIndex = (currentPage - 1) * 10
    let endIndex = currentPage*10
    return [startIndex, endIndex]
  }



  let onNextPage = ()=>{
    if( 9>=currentPage >= 1 ){
      setCurrentPage(currentPage + 1)
    }
  }

  let onPreviousPage = ()=>{
    if(currentPage > 1){
      setCurrentPage(currentPage - 1)
    }
  }


  if(flightsState.loadingFlights){
    return <></>
  }

  return (
    <main className="flex flex-col items-center gap-12">
      <h1 className="font-semibold text-gray-900 text-4xl mt-8">Vuelos Disponibles</h1>
      <div className="flex flex-col max-w-xl w-full">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Origen
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destino
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {flightsState.flights.slice(...pageRange()).map(({flightId, flightSource, flightDest, flightDate})=>{
                    return <tr key={flightId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                        {flightDate}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{flightSource}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{flightDest}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/flight/${flightId}`} className="text-blue-600 hover:text-blue-900">Reservar</Link>
                      </td>
                    </tr>
                  })}
                </tbody>
              </table>
              <nav
                className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
                aria-label="Pagination"
              >
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{(currentPage*10) - 9}</span> a <span className="font-medium">{(currentPage * 10)}</span> de{' '}
                    <span className="font-medium">100</span> resultados
                  </p>
                </div>
                <div className="flex-1 flex justify-between sm:justify-end">
                  <a
                    onClick={()=>{onPreviousPage()}}
                    className="cursor-pointer relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Previous
                  </a>
                  <a
                    onClick={()=>{onNextPage()}}
                    className="cursor-pointer ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Next
                  </a>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

const Flight = ()=>{
  const [flightState, setFlightState] = useState({flight:{},loadingFlight:false})
  const params = useParams()
  const passenger = JSON.parse(localStorage.getItem("passenger"))

  const getFlight =() =>{
    setFlightState({...flightState,loadingFlight:true})
    fetch(`http://localhost:5000/flight/${params.flightId}`)
    .then(response => response.json())
    .then(data => setFlightState({...flightState,flight:data.data,loadingFlights:false}));
  }

  useEffect(()=>{
    getFlight()
  },[])

  if(Object.keys(flightState.flight).length === 0){
    return <></>
  }

  const bookFlight = () =>{
    let booking={
      bookDate:newDate(),
      flightId: parseInt(params.flightId),
      passId: passenger.passId
    }
    fetch("http://localhost:5000/booking/",
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(booking)
    })
    .then(response => response.json())
    .then(data =>  window.location.href="/flights");
  }

  return (
    <main className="flex flex-col items-center gap-12">
      <h1 className="font-semibold text-gray-900 text-4xl mt-8">Vuelo ID: {Object.keys(flightState.flight).length > 0 && flightState.flight.flightId}</h1>
      <div className="flex flex-col">
        <div className="grid grid-cols-3">
          <div className="col-span-1">
            <h2 className="text-gray-900 text-lg font-semibold">Información de Vuelo</h2>
          </div>
          <div className="col-span-3 flex flex-col items-center p-4">
            {Object.keys(flightState.flight).length > 0 && 
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              <div className=""><b>Origen: </b>{flightState.flight.flightDate}</div>
              <div className=""><b>Fecha: </b>{flightState.flight.flightSource}</div>
              <div className=""><b>Destino: </b>{flightState.flight.flightDest}</div>
              <div className=""><b>Asiento: </b>{flightState.flight.flightSeat}</div>
              <div className="col-span-2">
                <div className=""><b>Precio: </b>${flightState.flight.ticketCost}</div>
              </div>
            </div>}
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div className="col-span-1">
            <h2 className="text-gray-900 text-lg font-semibold">Información del Cliente</h2>
          </div>
          <div className="col-span-3 flex flex-col items-center p-4">
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              <div className=""><b>Nombre: </b>{passenger.passName}</div>
              <div className=""><b>Correo: </b>{passenger.passMail}</div>
              <div className=""><b>Fecha de Registro: </b>{passenger.passDob}</div>
            </div>
          </div>
        </div>
      </div>
      <button onClick = {bookFlight} className="bg-blue-900 text-white px-6 py-2 hover:bg-blue-800 cursor-pointer rounded-md max-w-md">
        Reservar
      </button>
    </main>
  )
}

const Register = ()=>{
  const [formState, setFormState] = useState({name:"",email:""})

  const onChangeInput = (e)=>{
    setFormState({...formState,[e.target.name]:e.target.value})
  }

  const setPassenger = (data) =>{
    localStorage.setItem("passenger",JSON.stringify(data));
  }

  const createPassenger = () =>{
    let passenger={
      passName:formState.name,
      passMail:formState.email,
      passDob: newDate()
    }
    fetch("http://localhost:5000/passenger/",
    {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(passenger)
    })
    .then(response => response.json())
    .then(data => {if(data.status === 200){setPassenger({
      ...passenger,
      passId: data.passId
    })
    console.log(newDate())
    window.location.href="/flights"}});
  }

  return (
    <main className="flex flex-col items-center gap-12">
      <h1 className="font-semibold text-gray-900 text-4xl mt-8">Registro</h1>
      <div className="shadow py-8 px-12 rounded-md bg-white max-w-lg w-full">
        <h2 className="font-semibold text-gray-900 text-xl mb-4">Información del cliente</h2>
        <div className="flex flex-col items-start">
          <label htmlFor="name" className="font-medium">Nombre</label>
          <input onChange={onChangeInput} type="text" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" name="name"/>
        </div>
        <div className="flex flex-col items-start">
          <label htmlFor="email" className="font-medium">Correo</label>
          <input onChange={onChangeInput} type="email" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" name="email"/>
        </div>
      </div>
      <button onClick={createPassenger} className="bg-blue-900 text-white px-6 py-2 hover:bg-blue-800 cursor-pointer rounded-md">
        Registrar
      </button>
    </main>
  )
}
export default App;
