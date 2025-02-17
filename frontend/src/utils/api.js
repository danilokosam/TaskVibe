/**
 * Función auxiliar para realizar peticiones HTTP con fetch y manejo de errores
 * @param {string} url - La URL a la que se hace la petición
 * @param {object} options - Opciones para el fetch (método, headers, body, etc)
 * @param {function} rejectWithValue - Función que se usa para devolver el error al createAsyncThunk
 * @returns {Promise<any>} - La respuesta parseada a JSON si la petición es exitosa
 */

export async function safeFetch(url, options, rejectWithValue) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
}
