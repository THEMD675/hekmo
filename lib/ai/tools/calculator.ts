import { tool } from "ai";
import { z } from "zod";

export const calculatorTool = tool({
  description: "Perform mathematical calculations. Use this for any math operations, unit conversions, percentage calculations, BMI, calorie calculations, etc.",
  inputSchema: z.object({
    expression: z.string().describe("Mathematical expression to evaluate (e.g., '2 + 2', '15% of 200', 'sqrt(144)')"),
    type: z.enum(["basic", "bmi", "calories", "conversion"]).default("basic").describe("Type of calculation"),
    additionalParams: z.record(z.number()).optional().describe("Additional parameters for specific calculations (e.g., weight, height for BMI)"),
  }),
  execute: async ({ expression, type, additionalParams }) => {
    try {
      if (type === "bmi" && additionalParams) {
        const weight = additionalParams.weight; // kg
        const height = additionalParams.height; // cm
        if (weight && height) {
          const heightM = height / 100;
          const bmi = weight / (heightM * heightM);
          let category = "";
          let categoryAr = "";
          
          if (bmi < 18.5) {
            category = "Underweight";
            categoryAr = "نقص في الوزن";
          } else if (bmi < 25) {
            category = "Normal";
            categoryAr = "وزن طبيعي";
          } else if (bmi < 30) {
            category = "Overweight";
            categoryAr = "زيادة في الوزن";
          } else {
            category = "Obese";
            categoryAr = "سمنة";
          }
          
          return {
            success: true,
            type: "bmi",
            result: Math.round(bmi * 10) / 10,
            category,
            categoryAr,
            weight,
            height,
          };
        }
      }

      if (type === "calories" && additionalParams) {
        const { weight, height, age, activityLevel } = additionalParams;
        if (weight && height && age) {
          // Mifflin-St Jeor Equation (male default)
          const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
          const multipliers: Record<number, number> = {
            1: 1.2,   // Sedentary
            2: 1.375, // Light
            3: 1.55,  // Moderate
            4: 1.725, // Active
            5: 1.9,   // Very Active
          };
          const multiplier = multipliers[activityLevel || 2] || 1.375;
          const tdee = Math.round(bmr * multiplier);
          
          return {
            success: true,
            type: "calories",
            bmr: Math.round(bmr),
            tdee,
            forWeightLoss: tdee - 500,
            forWeightGain: tdee + 500,
          };
        }
      }

      // Basic calculation using Function (safer than eval)
      // Replace common expressions
      let safeExpression = expression
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/\^/g, "**")
        .replace(/sqrt\(/g, "Math.sqrt(")
        .replace(/sin\(/g, "Math.sin(")
        .replace(/cos\(/g, "Math.cos(")
        .replace(/tan\(/g, "Math.tan(")
        .replace(/log\(/g, "Math.log10(")
        .replace(/ln\(/g, "Math.log(")
        .replace(/pi/gi, "Math.PI")
        .replace(/(\d+)%\s*of\s*(\d+)/gi, "($1/100)*$2")
        .replace(/(\d+)%/g, "($1/100)");

      // Validate expression contains only safe characters
      if (!/^[\d\s+\-*/().Math,sqrtsincogtanlope\[\]%]*$/i.test(safeExpression.replace(/Math\.\w+/g, ""))) {
        throw new Error("Invalid expression");
      }

      const result = Function(`"use strict"; return (${safeExpression})`)();
      
      return {
        success: true,
        type: "basic",
        expression,
        result: typeof result === "number" ? Math.round(result * 1000000) / 1000000 : result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Calculation failed",
        expression,
      };
    }
  },
});
