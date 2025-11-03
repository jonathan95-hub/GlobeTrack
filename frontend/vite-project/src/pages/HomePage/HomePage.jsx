// import React from 'react'
// import MapGlobal from '../../components/HomePage/Map'
// import ListBestPost from '../../components/HomePage/ListBestPost'
// import RadialTopVisitedComponent from '../../components/HomePage/RadialTopVisitedComponent'

// const HomePage = () => {
//   return (
//     <div className="container my-4">
//       {/* Grid principal */}
//       <div
//         className="home-grid"
//         style={{
//           display: 'grid',
//           gridTemplateColumns: '2fr 1fr', // Mapa+Radial 2/3, Lista 1/3
//           gridTemplateRows: 'auto 400px', // Primera fila: mapa, segunda fila: radial
//           gap: '1rem',
//         }}
//       >
//         {/* Mapa arriba a la izquierda */}
//         <div style={{ gridColumn: '1 / 2', gridRow: '1 / 2' }}>
//           <MapGlobal className="map" />
//         </div>

//         {/* Lista siempre a la derecha, ocupa ambas filas */}
//         <div style={{ gridColumn: '2 / 3', gridRow: '1 / 3' }}>
//           <ListBestPost />
//         </div>

//         {/* Radial debajo del mapa */}
//         <div style={{ gridColumn: '1 / 2', gridRow: '2 / 3', position: 'relative' }}>
//           <RadialTopVisitedComponent />
//         </div>
//       </div>

//       {/* Secciones adicionales debajo */}
//       <div className="mt-4">
//         <div className="mb-3 p-3 border">Gráfica 2</div>
//         <div className="mb-3 p-3 border">Ranking</div>
//         <div className="mb-3 p-3 border">Top publicaciones</div>
//         <div className="mb-3 p-3 border">Top viajeros</div>
//       </div>
//     </div>
//   )
// }

// export default HomePage



import React from 'react';
import MapGlobal from '../../components/HomePage/Map';
import ListBestPost from '../../components/HomePage/ListBestPost';
import RadialTopVisitedDesiredComponent from '../../components/HomePage/RadialTopVisitedAndDesiredComponent';
import ToptravelersComponent from '../../components/HomePage/ToptravelersComponent';
import TopGroups from '../../components/HomePage/TopGroups';


const HomePage = () => {
  return (
    <div className='bgHome grid modeColumn bgHomePage'>
      <div className='mapGrid'>
        <MapGlobal/>
      </div>
      <div className='listGrid'>
        <ListBestPost/>
      </div>
      <div className='radialGrid'>
        <RadialTopVisitedDesiredComponent/>
      </div>
      <div className='travelersGrid'>
        <ToptravelersComponent/>
      </div>
      <div className='groupGrid'>
        <TopGroups/>
      </div>
    </div>
  );
}

export default HomePage;
