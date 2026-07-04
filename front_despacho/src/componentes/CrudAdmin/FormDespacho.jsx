import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";

export const FormDespacho = ({ venta, onClose, onDespachoCreado }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    if (!venta || !venta.idVenta) {
      Swal.fire({
        title: "Error",
        text: "No se encontró la venta asociada al despacho.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    const jsonData = {
      fechaDespacho: data.fechaDespacho,
      patenteCamion: data.patenteCamion,
      intento: 0,
      entregado: false,
      idCompra: venta.idVenta,
      direccionCompra: venta.direccionCompra,
      valorCompra: venta.valorCompra,
    };

    const jsonDataSales = {
  ...venta,
  despachoGenerado: true,
    };

    console.log("Venta recibida:", venta);
    console.log("Datos despacho enviados:", jsonData);
    console.log("Datos venta enviados:", jsonDataSales);

    try {
      await axios.put(`/api/v1/ventas/${venta.idVenta}`, jsonDataSales, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      await axios.post("/api/v1/despachos", jsonData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      Swal.fire({
        title: "Despacho registrado 🛻",
        text: "El despacho fue generado correctamente en la base de datos.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      if (onDespachoCreado) {
        onDespachoCreado();
      }

      onClose();
    } catch (error) {
      console.error("Error en la solicitud:", error);

      Swal.fire({
        title: "Error al registrar despacho",
        text:
          error.response?.data?.message ||
          error.response?.data ||
          "No se pudo registrar el despacho. Revisa la consola o los logs del backend.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center text-center px-24 text-xl"
      >
        <div className="mx-auto text-3xl font-bold mb-10 text-teal-600">
          Ingreso de orden de despacho
        </div>

        <div className="mb-5">
          <label className="block font-bold mb-2">Fecha de despacho</label>
          <input
            type="date"
            className="border border-gray-300 rounded-lg block w-full p-1"
            {...register("fechaDespacho", {
              required: "La fecha de despacho es obligatoria",
            })}
          />
          {errors.fechaDespacho && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fechaDespacho.message}
            </p>
          )}
        </div>

        <div className="mb-5">
          <label className="block font-bold mb-2">Patente de camión</label>
          <input
            type="text"
            placeholder="Ej: ABCD12"
            className="border border-gray-300 rounded-lg block w-full p-1"
            {...register("patenteCamion", {
              required: "La patente del camión es obligatoria",
            })}
          />
          {errors.patenteCamion && (
            <p className="text-red-500 text-sm mt-1">
              {errors.patenteCamion.message}
            </p>
          )}
        </div>

        <div className="mb-5">
          <label className="block font-bold mb-2">
            Orden de compra asociada
          </label>
          <input
            type="number"
            disabled
            value={venta?.idVenta || ""}
            className="border border-gray-300 rounded-lg block w-full text-slate-400 p-1"
          />
        </div>

        <div className="mb-5">
          <label className="block font-bold mb-2">Dirección de entrega</label>
          <input
            type="text"
            disabled
            value={venta?.direccionCompra || ""}
            className="border border-gray-300 rounded-lg block w-full text-slate-400 p-1"
          />
        </div>

        <div className="mb-5">
          <label className="block font-bold mb-2">Valor de compra</label>
          <input
            type="number"
            disabled
            value={venta?.valorCompra || ""}
            className="border border-gray-300 rounded-lg block w-full text-slate-400 p-1"
          />
        </div>

        <button
          className="py-6 px-14 rounded-lg bg-teal-600 text-white font-bold mb-14 disabled:bg-gray-400"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registrando..." : "Asignar despacho"}
        </button>
      </form>
    </>
  );
};