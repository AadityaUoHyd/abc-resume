import React from "react";
import Input from "../../../components/Inputs/Input";
import { Plus, Trash2 } from "lucide-react";
import RatingInput from "../../../components/ResumeSections/RatingInput";

const AdditionalInfoFrom = ({
  languages,
  interests,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}) => {
  return <div className="px-5 pt-5">
      <h2 className="text-lg font-semibold text-gray-900">Additional Info</h2>

      {/* Languages Section */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Languages</h3>
        <div className="flex flex-col gap-4">
          {languages?.map((lang, index) => (
            <div
              key={index}
              className="border border-gray-200 p-4 rounded-lg relative"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <Input
                  label="Language"
                  placeholder="e.g. English"
                  value={lang.name || ""}
                  onChange={({ target }) =>
                    updateArrayItem("languages", index, "name", target.value)
                  }
                />

                <div>
                  <label className="text-xs font-medium text-slate-600 mb-7 block">
                    Proficiency
                  </label>
                  <RatingInput
                    value={lang.progress || 0}
                    onChange={(value) =>
                      updateArrayItem("languages", index, "progress", value)
                    }
                    total={5}
                    activeColor="#0ea5e9"
                    inactiveColor="#e0f2fe"
                  />
                </div>
              </div>

              {languages.length > 1 && (
                <button
                  type="button"
                  className="absolute top-3 right-3 text-sm text-red-600 hover:underline cursor-pointer"
                  onClick={() => removeArrayItem("languages", index)}
                >
                  <Trash2 />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="self-start flex items-center gap-2 px-4 py-2 rounded bg-purple-100 text-purple-800 text-sm font-medium hover:bg-purple-200 cursor-pointer"
            onClick={() => addArrayItem("languages", { name: "", progress: 0 })}
          >
            <Plus /> Add Language
          </button>
        </div>
      </div>

      {/* Interests Section */}
      <div className="mt-8 mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Interests</h3>
        <div className="flex flex-col">
          {interests?.map((interest, index) => (
            <div
              key={index}
              className="relative rounded-lg"
            >
              <Input
                placeholder="e.g. Reading"
                value={interest || ""}
                onChange={({ target }) =>
                  updateArrayItem("interests", index, null, target.value)
                }
              />

              {interests.length > 1 && (
                <button
                  type="button"
                  className="absolute top-6.5 right-3 text-sm text-red-600 hover:underline cursor-pointer"
                  onClick={() => removeArrayItem("interests", index)}
                >
                  <Trash2 />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="self-start flex items-center gap-2 px-4 py-2 rounded bg-purple-100 text-purple-800 text-sm font-medium hover:bg-purple-200 cursor-pointer"
            onClick={() => addArrayItem("interests", "")}
          >
            <Plus /> Add Interest
          </button>
        </div>
      </div>
    </div>
};

export default AdditionalInfoFrom;
