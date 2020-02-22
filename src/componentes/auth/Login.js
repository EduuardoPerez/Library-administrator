import React, { Component } from 'react';
import { firebaseConnect } from 'react-redux-firebase';

class Login extends Component {
  state = {
    email: '',
    password: ''
  }

  // Login in firebase
  iniciarSesion = e => {
    e.preventDefault();

    // Extract firebase
    const { firebase } = this.props;

    // Extract state
    const { email, password } = this.state;

    // Authenticate the user
    firebase.login({
      email,
      password
    })
    .then(resultado => console.log('Sesión iniciada'))
    .catch(error => console.log('Error al iniciar sesión'));
  }

  // Get what the user writes in the inputs in the state
  leerDatos = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    return (
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card mt-5">
            <div className="card-body">
              <h2 className="text-center py-4">
                <i className="fas fa-lock"></i> {''}
                Iniciar sesión
              </h2>
              <form
                onSubmit={this.iniciarSesion}
              >
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    required
                    value={this.state.email}
                    onChange={this.leerDatos}
                  />
                </div>
                <div className="form-group">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    required
                    value={this.state.password}
                    onChange={this.leerDatos}
                  />
                </div>
                <input
                  type="submit"
                  value="Iniciar sesión"
                  className="btn btn-success btn-block"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default firebaseConnect()(Login);
