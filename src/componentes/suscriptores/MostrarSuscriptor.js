import React from 'react';// Compose es una utilidad (de programación funcional)
// que permite aplicar múltiples potenciadores de store en serie
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Spinner from '../layout/Spinner';

const MostrarSuscriptor = () => {
  return (
    <h1>MostrarSuscriptor</h1>  
  );
};

export default compose(
  firestoreConnect( props => [
    {
      collection: 'suscriptores',
      storeAs: 'suscriptor',
      doc: props.match.params.id
    }
  ]),
  connect(( {firestore: { ordered }}, props ) => ({
    suscriptor: ordered.suscriptor && ordered.suscriptor[0]
  }))
)(MostrarSuscriptor);
