import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';

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
