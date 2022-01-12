import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet
} from "react-router-dom";

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
  return (
    <main className="flex flex-col items-center gap-12">
      <h1 className="font-semibold text-gray-900 text-4xl mt-8">Vuelos Disponibles</h1>
      <div class="flex flex-col max-w-xl w-full">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Origen
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destino
                    </th>
                    <th scope="col" class="relative px-6 py-3">
                      <span class="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">
                        2020/01/22
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">Ecuador</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">Colombia</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/flight/${1}`} class="text-blue-600 hover:text-blue-900">Reservar</Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

const Flight = ()=>{
  return (
    <main className="flex flex-col items-center gap-12">
      <h1 className="font-semibold text-gray-900 text-4xl mt-8">Vuelo ID: 1231231</h1>
      <div className="flex flex-col">
        <div className="grid grid-cols-3">
          <div className="col-span-1">
            <h2 className="text-gray-900 text-lg font-semibold">Información de Vuelo</h2>
          </div>
          <div className="col-span-3 flex flex-col items-center p-4">
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              <div className=""><b>Origen: </b>Ecuador</div>
              <div className=""><b>Fecha: </b>2020/01/22</div>
              <div className=""><b>Destino: </b>Colombia</div>
              <div className=""><b>Asiento: </b>24</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div className="col-span-1">
            <h2 className="text-gray-900 text-lg font-semibold">Información del Cliente</h2>
          </div>
          <div className="col-span-3 flex flex-col items-center p-4">
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              <div className=""><b>Nombre: </b>Camilo Gutiérrez</div>
              <div className=""><b>Correo: </b>gcemas20@gmail.com</div>
              <div className=""><b>Fecha de Registro: </b>2020/01/22</div>
            </div>
          </div>
        </div>
      </div>
      <button className="bg-blue-900 text-white px-6 py-2 hover:bg-blue-800 cursor-pointer rounded-md max-w-md">
        Reservar
      </button>
    </main>
  )
}

const Register = ()=>{
  return (
    <main className="flex flex-col items-center gap-12">
      <h1 className="font-semibold text-gray-900 text-4xl mt-8">Registro</h1>
      <div className="shadow py-8 px-12 rounded-md bg-white max-w-lg w-full">
        <h2 className="font-semibold text-gray-900 text-xl mb-4">Información del cliente</h2>
        <div className="flex flex-col items-start">
          <label htmlFor="name" className="font-medium">Nombre</label>
          <input type="text" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" name="name"/>
        </div>
        <div className="flex flex-col items-start">
          <label htmlFor="email" className="font-medium">Correo</label>
          <input type="email" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" name="email"/>
        </div>
      </div>
      <button className="bg-blue-900 text-white px-6 py-2 hover:bg-blue-800 cursor-pointer rounded-md">
        Registrar
      </button>
    </main>
  )
}
export default App;
