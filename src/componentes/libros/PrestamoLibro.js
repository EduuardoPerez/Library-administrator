import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';

import FichaSuscriptor from '../suscriptores/FichaSuscriptor';

class PrestamoLibro extends Component {
  state={
    busqueda: '',
    resultado: {},
    noResultados: false
  }

  // Search subscriber for code
  buscarAlumno = e => {
    e.preventDefault();

    // Get the value to search
    const { busqueda } = this.state

    // Extract firestore
    const { firestore } = this.props;

    // Make the query
    const coleccion = firestore.collection('suscriptores');
    const consulta = coleccion.where("codigo", "==", busqueda).get();

    // Read the results
    consulta.then(resultado => {
      if (resultado.empty) {
        // No results
        this.setState({
          noResultados:true,
          resultado: {}
        })
      } else {
        // There are results
        const datos = resultado.docs[0];
        this.setState({
          resultado: datos.data(),
          noResultados: false
        })
      }
    })
  }

  // Store student data to request the book
  solitarPrestamo = () => {
    const suscriptor = this.state.resultado;

    // Application date
    suscriptor.fecha_solicitud = new Date().toLocaleDateString();

    // Get the book
    const libroActualizado = this.props.libro;

    // Add the subscriber to the book
    libroActualizado.prestados.push(suscriptor);

    // Get firestore & history from props
    const { firestore, history, libro } = this.props;

    // Save in DB
    firestore.update({
      collection: 'libros',
      doc: libro.id
    }, libroActualizado).then(history.push('/'));


  }

  // Save code in the state
  leerDato = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  

  render() {
    // Extract book from props
    const { libro } = this.props;

    // Show spinner
    if(!libro) return <Spinner />

    // Extract the subscriber's information for display it
    const { noResultados, resultado } = this.state;

    let fichaAlumno, btnSolicitar;

    if (resultado.nombre) {
      fichaAlumno = <FichaSuscriptor
                      alumno={resultado}
                    />
      btnSolicitar = <button 
                       type="button"
                       className="btn btn-primary btn-block"
                       onClick={this.solitarPrestamo}
                     >Solicitar prestamo</button>
    } else {
      fichaAlumno = null;
      btnSolicitar = null;
    }
    
    return (
      <div className="row">
        <div className="col-12 mb-4">
          <Link to={'/'} className="btn btn-secondary">
            <i className="fas fa-arrow-circle-left"></i> {''}
            Volver al listado
          </Link>
        </div>
        <div className="col-12">
          <h2>
            <i className="fas fa-book"></i> {''}
            Solicitar prestamo: {libro.titulo}
          </h2>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <form
                onSubmit={this.buscarAlumno}
                className="mb-4"
              >
                <legend className="color-primary text-center">
                  Buscar suscriptor por código
                </legend>
                <div className="form-group">
                  <input
                    type="text"
                    name="busqueda"
                    className="form-control"
                    onChange={this.leerDato}
                  />
                </div>
                <input type="submit" className="btn btn-success btn-block" value="Buscar alumno"/>
              </form>
              {/* Show the student file and the button to request the loan */}
              {fichaAlumno}
              {btnSolicitar}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PrestamoLibro.propTypes = {
  firestore: PropTypes.object.isRequired
}

export default compose(
  firestoreConnect( props => [
    {
      collection: 'libros',
      storeAs: 'libro',
      doc: props.match.params.id
    }
  ]),
  connect(( {firestore: { ordered }}, props ) => ({
    libro: ordered.libro && ordered.libro[0]
  }))
)(PrestamoLibro);
