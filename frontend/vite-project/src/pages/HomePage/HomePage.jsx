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
    <div className="container-fluid bg-light py-4 min-vh-100">
      <div className="row g-4">

        {/* Columna izquierda */}
        <div className="col-12 col-lg-7 d-flex flex-column gap-4">
          
          {/* Mapa */}
          <div className="card shadow-lg border-0">
            <div className="card-body p-3">
              <h4 className="text-primary fw-bold mb-3 text-center">Mapa Global</h4>
              <MapGlobal />
            </div>
          </div>

          {/* Radial */}
          <div className="card shadow border-0">
            <div className="card-body p-3">
              <h4 className="text-info fw-bold mb-3 text-center">Top Lugares Visitados</h4>
              <RadialTopVisitedDesiredComponent />
            </div>
          </div>

          
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div className="card shadow border-0 h-100">
                <div className="card-body p-3">
                  <h4 className="text-danger fw-bold mb-3 text-center">Grupos Destacados</h4>
                  <TopGroups />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card shadow border-0 h-100">
                <div className="card-body p-3">
                  <h4 className="text-warning fw-bold mb-3 text-center">Top Viajeros</h4>
                  <ToptravelersComponent />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha: ListBestPost */}
        <div className="col-12 col-lg-5 d-flex flex-column h-100">
          <div className="card shadow-lg border-0 flex-grow-1">
            <div className="card-body p-3">
              <h4 className="text-success fw-bold mb-3 text-center">Mejores Publicaciones</h4>
              <ListBestPost />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
