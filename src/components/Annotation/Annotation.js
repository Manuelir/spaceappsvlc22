// import useApi from '../../hooks/useApi';
// import astros from '../../api/astros';
// import { useCallback, useEffect, useState } from 'react';

const Annotation = () => {
  // const getAstros = useApi(astros.getAstros);
  // const [issAstros, setIssAstros] = useState([]);

  // const getIssAstros = useCallback(async () => {
  //   const astros = await getAstros.request();
  //   const people = astros.data.people;

  //   const issAstros = people.filter((astro) => astro.craft === 'ISS');
  //   setIssAstros(issAstros);
  // }, [getAstros]);

  // useEffect(() => {
  //   let isMounted = true;
  //   if (isMounted) getIssAstros();
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [getIssAstros]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        marginLeft: 15,
        marginTop: 15,
        padding: '1em',
        width: 220,
        color: '#000',
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '.5em',
        fontSize: 12,
        lineHeight: 1.2,
      }}
    >
      <h4>Estacion Espacial Internacional</h4>

      <br />

      <p>
         Es una estación espacial modular ubicada en órbita terrestre baja. mantiene un
         órbita con una <strong>altitud media de 400 kilómetros</strong> gracias
         a maniobras realizadas periódicamente con los motores Zvezda o visitando
         vehículos
         <br />
         <br />
         La estación viaja a una <strong>promedio de 27.500 km/h</strong>, haciendo un
         vuelta completa alrededor de la tierra en unos 93 minutos{' '}
         <strong>completando 15,5 órbitas cada día</strong>.
        {/* <br />
        <br />
        At this moment, it is manned by: */}
      </p>

      {/* <ul style={{ listStyleType: 'none' }}>
        {issAstros.map((astro) => {
          return (
            <li key={astro.name} style={{ marginLeft: 12 }}>
              {astro.name}
            </li>
          );
        })}
      </ul> */}
    </div>
  );
};

export default Annotation;
