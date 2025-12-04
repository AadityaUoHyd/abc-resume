import React from "react";
import Input from "../../../components/Inputs/Input";
import { Plus, Trash2 } from "lucide-react";

const CertificationInfoFrom = ({
  certifications,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}) => {
  return <div className="px-5 pt-5">
      <h2 className="text-lg font-semibold text-gray-900">Certifications</h2>

      <div className="mt-4 flex flex-col gap-4 mb-3">
        {certifications.map((cert, index) => (
          <div
            key={index}
            className="border border-gray-200/80 p-4 rounded-lg relative"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Certificate Title"
                placeholder="Soft Skills Certification / AWS (SAA-C03) / etc."
                type="text"
                value={cert.title || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "title", target.value)
                }
              />

              <Input
                label="Issuer"
                placeholder="Coursera / Google / etc."
                type="text"
                value={cert.issuer || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "issuer", target.value)
                }
              />

              <Input
                label="Year"
                placeholder="2024"
                type="text"
                value={cert.year || ""}
                maxLength={4}
                pattern="[0-9]{4}"
                onChange={({ target }) => {
                  // Only allow numbers and limit to 4 digits
                  const value = target.value.replace(/[^0-9]/g, '').slice(0, 4);
                  updateArrayItem(index, "year", value);
                }}
                onKeyPress={(e) => {
                  // Prevent non-numeric characters
                  if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            {certifications.length > 1 && (
              <button
                type="button"
                className="absolute top-3 right-3 text-sm text-red-600 hover:underline cursor-pointer"
                onClick={() => removeArrayItem(index)}
              >
                <Trash2 />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className="self-start flex items-center gap-2 px-4 py-2 rounded bg-purple-100 text-purple-800 text-sm font-medium hover:bg-purple-200 cursor-pointer"
          onClick={() =>
            addArrayItem({
              title: "",
              issuer: "",
              year: "",
            })
          }
        >
          <Plus /> Add Certification
        </button>
      </div>
    </div>
};

export default CertificationInfoFrom;
