import { EventPlan, EventPlanSchema } from '@eventcraft/shared';

/**
 * Downloads an EventPlan object as an indented .json file
 */
export function downloadPlanJson(plan: EventPlan): void {
  const dataStr =
    'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(plan, null, 2));
  const safeName = plan.eventInput.eventName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const filename = `${safeName}-plan.json`;

  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Reads, parses, and strictly validates an uploaded JSON plan file using Zod
 */
export async function parsePlanJsonFile(file: File): Promise<EventPlan> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const validated = EventPlanSchema.parse(parsed);
        resolve(validated);
      } catch (err) {
        reject(
          new Error(
            'The uploaded file is not a valid EventCraft plan JSON format. Please verify the file contents.',
          ),
        );
      }
    };
    reader.onerror = () => reject(new Error('Failed to read the selected file.'));
    reader.readAsText(file);
  });
}

/**
 * Triggers the browser print dialog
 */
export function printPlanView(): void {
  window.print();
}
