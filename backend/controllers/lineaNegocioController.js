import * as lineaService from '../services/lineaNegocioService.js';

export const getLineas = async (req, res) => {
    try {
        const {buscar} = req.query;
        const lineas = await lineaService.listarLineas(buscar);
        return res.json({ success: true, data: lineas });
    } catch (error) {
        return res.status(500).json({ err: true, message: "Error interno al obtener el catálogo." });
    }
};
export const getLinea = async (req, res) => {
    try {
        const lineas = await lineaService.getLinea(req.params.id);
        return res.json({ success: true, data: lineas });
    } catch (error) {
        return res.status(500).json({ err: true, message: "Error interno al obtener el catálogo." });
    }
};
export const postLinea = async (req, res) => {
    const { nombre, descripcion } = req.body;
    if (!nombre) {
        return res.status(400).json({ err: true, message: "El campo 'nombre' es estrictamente obligatorio." });
    }

    try {
        await lineaService.crearLinea(req.body);//nombre, descripcion
        return res.status(201).json({ success: true, message: "¡Línea de negocio guardada exitosamente!" });
    } catch (error) {
        return res.status(500).json({ err: true, message: "Error interno al registrar la línea de negocio." });
    }
};

export const putLinea = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    if (!nombre) {
        return res.status(400).json({ err: true, message: "El nombre no puede quedar vacío." });
    }

    try {
        const completado = await lineaService.actualizarLinea({id, nombre, descripcion});
        if (!completado) {
            return res.status(404).json({ err: true, message: "La línea de negocio solicitada no existe." });
        }
        return res.json({ success: true, message: "Línea de negocio modificada correctamente." });
    } catch (error) {
        return res.status(500).json({ err: true, message: "Error interno al actualizar el registro." });
    }
};

export const deleteLinea = async (req, res) => {
    const { id } = req.params;

    try {
        const completado = await lineaService.eliminarLinea(id);
        if (!completado) {
            return res.status(404).json({ err: true, message: "La línea de negocio solicitada no existe." });
        }
        return res.json({ success: true, message: "Registro eliminado satisfactoriamente." });
    } catch (error) {
        return res.status(500).json({ err: true, message: "Error interno al procesar la eliminación." });
    }
};