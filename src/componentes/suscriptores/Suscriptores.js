import React from 'react';
// Compose es una utilidad (de programación funcional)
// que permite aplicar múltiples potenciadores de store en serie
import { compose } from 'redux'
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';


const Suscriptores = () => {
  return (
    <h1>Suscriptores</h1>
  );
};

export default compose(
  firestoreConnect([{ collection: 'suscriptores'}]),
  connect((state, props) => ({
    suscriptores: state.firestore.ordered.suscriptores
  }))
)(Suscriptores);