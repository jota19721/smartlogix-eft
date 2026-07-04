import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";

export const FormVenta = ({ onVentaCreada }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const nuevaVenta = {
      direccionCompra: data.direccionCompra,
      valorCompra: Number(data.valorCompra),
      fechaCompra: data.fechaCompra,
      despachoGenerado: false,
    };

    console.log("Venta enviada:", nuevaVenta);

    try {
      await axios.post("/api/v1/ventas", nuevaVenta, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      Swal.fire({
        title: "Venta registrada",
        text: "La venta fue creada correctamente en la base de datos.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      reset();

      if (onVentaCreada) {
        onVentaCreada();
      }
    } catch (error) {
      console.error("Error al crear venta:", error);

      Swal.fire({
        title: "Error al crear venta",
        text:
          error.response?.data?.message ||
          error.response?.data ||
          "No se pudo crear la venta. Revisa los logs del backend.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white border border-gray-200 rounded-lg shadow p-6 mb-8 text-center"
    >
      <h2 className="text-2xl font-bold text-teal-600 mb-6">
        Registrar nueva venta
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        <div>
          <label className="block font-bold mb-2">Dirección de compra</label>
          <input
            type="text"
            placeholder="Ej: Av. Siempre Viva 123"
            className="border border-gray-300 rounded-lg block w-full p-2"
            {...register("direccionCompra", {
              required: "La dirección es obligatoria",
            })}
          />
          {errors.direccionCompra && (
            <p className="text-red-500 text-sm mt-1">
              {errors.direccionCompra.message}
            </p>
          )}
        </div>

        <div>
          <label className="block font-bold mb-2">Valor compra</label>
          <input
            type="number"
            placeholder="Ej: 25000"
            className="border border-gray-300 rounded-lg block w-full p-2"
            {...register("valorCompra", {
              required: "El valor es obligatorio",
              min: {
                value: 1,
                message: "El valor debe ser mayor a 0",
              },
            })}
          />
          {errors.valorCompra && (
            <p className="text-red-500 text-sm mt-1">
              {errors.valorCompra.message}
            </p>
          )}
        </div>

        <div>
          <label className="block font-bold mb-2">Fecha compra</label>
          <input
            type="date"
            className="border border-gray-300 rounded-lg block w-full p-2"
            {...register("fechaCompra", {
              required: "La fecha es obligatoria",
            })}
          />
          {errors.fechaCompra && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fechaCompra.message}
            </p>
          )}
        </div>

        <div className="flex items-end h-full">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-6 rounded-lg bg-teal-600 text-white font-bold disabled:bg-gray-400"
          >
            {isSubmitting ? "Registrando..." : "Crear venta"}
          </button>
        </div>
      </div>
    </form>
  );
};