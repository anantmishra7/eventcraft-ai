import React, { useState } from 'react';
import {
  EventSetupInput,
  EventSetupInputSchema,
  EventType,
  POPULAR_INDIAN_CITIES,
} from '@eventcraft/shared';
import { usePlan } from '../../context/PlanContext';
import { formatINR } from '../../utils/formatters';
import styles from './EventForm.module.css';

export const EventForm: React.FC = () => {
  const { createPlan, isGenerating } = usePlan();

  // Tomorrow's date as min date
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [formData, setFormData] = useState<EventSetupInput>({
    eventType: 'wedding',
    eventName: '',
    date: tomorrow,
    guestCount: 200,
    totalBudget: 1000000,
    city: 'Mumbai',
    themePreferences: '',
    dietaryNeeds: '',
    additionalNotes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value,
    }));

    // Clear error for field
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleFillSample = (type: EventType) => {
    if (type === 'wedding') {
      setFormData({
        eventType: 'wedding',
        eventName: 'Kabir & Tara Royal Destination Wedding',
        date: '2026-12-12',
        guestCount: 300,
        totalBudget: 2500000,
        city: 'Udaipur',
        themePreferences: 'Palatial Heritage with Royal Emerald & Gold drapes',
        dietaryNeeds: 'Jain counter, live chaat bazaar, regional Rajasthani feast',
        additionalNotes: 'Need 2-day coordination for Sangeet and Pheras',
      });
    } else if (type === 'birthday') {
      setFormData({
        eventType: 'birthday',
        eventName: 'Arya 1st Birthday Carnival Extravaganza',
        date: '2026-11-15',
        guestCount: 80,
        totalBudget: 150000,
        city: 'Bengaluru',
        themePreferences: 'Whimsical Pastel Hot Air Balloons & Teddy Bears',
        dietaryNeeds: 'Kid-safe treats, eggless cake, finger sandwiches',
        additionalNotes: 'Require interactive photo booth and magician',
      });
    } else {
      setFormData({
        eventType: 'community',
        eventName: 'Diwali Grand Utsav & Cultural Mela',
        date: '2026-11-01',
        guestCount: 500,
        totalBudget: 800000,
        city: 'Delhi NCR',
        themePreferences: 'Traditional Diya Illumination and Floral Rangoli',
        dietaryNeeds: 'Pure Vegetarian multi-course buffet',
        additionalNotes: 'Sound stage for cultural classical dance & fireworks display',
      });
    }
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = EventSetupInputSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await createPlan(result.data);
    } catch {
      // Error handled via toast
    }
  };

  return (
    <section className={styles.formSection} aria-labelledby="form-heading">
      <div className={styles.headerWrap}>
        <span className={styles.eyebrow}>AI-Powered Celebration Engineering</span>
        <h1 id="form-heading" className={styles.heading}>
          Plan Your Dream Event in Seconds
        </h1>
        <p className={styles.subheading}>
          Input your celebration vision below. Our GenAI planner calculates balanced INR budgets,
          creates milestone countdown timelines, verifies vendor checklists, and crafts bespoke
          ideas.
        </p>

        {/* Quick Sample Fill Pill Bar */}
        <div className={styles.sampleBar} aria-label="Pre-fill sample data">
          <span className={styles.sampleLabel}>Fast Test:</span>
          <button
            type="button"
            className={styles.samplePill}
            onClick={() => handleFillSample('wedding')}
          >
            👰 Royal Wedding
          </button>
          <button
            type="button"
            className={styles.samplePill}
            onClick={() => handleFillSample('birthday')}
          >
            🎂 1st Birthday
          </button>
          <button
            type="button"
            className={styles.samplePill}
            onClick={() => handleFillSample('community')}
          >
            🪔 Cultural Mela
          </button>
        </div>
      </div>

      <form className={styles.formCard} onSubmit={handleSubmit} noValidate>
        {/* Basic Event Details Fieldset */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Event Essentials</legend>

          <div className={styles.grid2}>
            {/* Event Type */}
            <div className={styles.formGroup}>
              <label htmlFor="eventType" className={styles.label}>
                Event Type <span className={styles.required}>*</span>
              </label>
              <select
                id="eventType"
                name="eventType"
                className={styles.select}
                value={formData.eventType}
                onChange={handleInputChange}
                aria-required="true"
              >
                <option value="wedding">Grand Wedding</option>
                <option value="birthday">Birthday Celebration</option>
                <option value="community">Community / Festival Gathering</option>
                <option value="corporate">Corporate Gala / Seminar</option>
                <option value="anniversary">Anniversary Celebration</option>
                <option value="other">Other Celebration</option>
              </select>
            </div>

            {/* Event Name */}
            <div className={styles.formGroup}>
              <label htmlFor="eventName" className={styles.label}>
                Event Name / Title <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="eventName"
                name="eventName"
                className={`${styles.input} ${errors.eventName ? styles.inputError : ''}`}
                placeholder="e.g. Kabir & Tara Royal Wedding"
                value={formData.eventName}
                onChange={handleInputChange}
                aria-required="true"
                aria-invalid={Boolean(errors.eventName)}
                aria-describedby={errors.eventName ? 'eventName-error' : undefined}
              />
              {errors.eventName && (
                <span id="eventName-error" className={styles.errorMessage} role="alert">
                  {errors.eventName}
                </span>
              )}
            </div>
          </div>

          <div className={styles.grid3}>
            {/* Date */}
            <div className={styles.formGroup}>
              <label htmlFor="date" className={styles.label}>
                Event Date <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                min={tomorrow}
                className={`${styles.input} ${errors.date ? styles.inputError : ''}`}
                value={formData.date}
                onChange={handleInputChange}
                aria-required="true"
                aria-invalid={Boolean(errors.date)}
                aria-describedby={errors.date ? 'date-error' : undefined}
              />
              {errors.date && (
                <span id="date-error" className={styles.errorMessage} role="alert">
                  {errors.date}
                </span>
              )}
            </div>

            {/* Guest Count */}
            <div className={styles.formGroup}>
              <label htmlFor="guestCount" className={styles.label}>
                Estimated Guests <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="guestCount"
                name="guestCount"
                min="5"
                max="10000"
                className={`${styles.input} ${errors.guestCount ? styles.inputError : ''}`}
                value={formData.guestCount || ''}
                onChange={handleInputChange}
                aria-required="true"
                aria-invalid={Boolean(errors.guestCount)}
                aria-describedby={errors.guestCount ? 'guestCount-error' : undefined}
              />
              {errors.guestCount && (
                <span id="guestCount-error" className={styles.errorMessage} role="alert">
                  {errors.guestCount}
                </span>
              )}
            </div>

            {/* City */}
            <div className={styles.formGroup}>
              <label htmlFor="city" className={styles.label}>
                City / Location <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                list="city-suggestions"
                className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
                placeholder="e.g. Jaipur"
                value={formData.city}
                onChange={handleInputChange}
                aria-required="true"
                aria-invalid={Boolean(errors.city)}
                aria-describedby={errors.city ? 'city-error' : undefined}
              />
              <datalist id="city-suggestions">
                {POPULAR_INDIAN_CITIES.map(c => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              {errors.city && (
                <span id="city-error" className={styles.errorMessage} role="alert">
                  {errors.city}
                </span>
              )}
            </div>
          </div>
        </fieldset>

        {/* Budget Fieldset */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Budget & Preferences</legend>

          <div className={styles.formGroup}>
            <div className={styles.budgetLabelRow}>
              <label htmlFor="totalBudget" className={styles.label}>
                Total Budget (INR) <span className={styles.required}>*</span>
              </label>
              <span className={styles.budgetDisplay} aria-live="polite">
                Formatted: <strong>{formatINR(formData.totalBudget)}</strong>
              </span>
            </div>
            <input
              type="number"
              id="totalBudget"
              name="totalBudget"
              min="10000"
              max="100000000"
              step="5000"
              className={`${styles.input} ${styles.budgetInput} ${errors.totalBudget ? styles.inputError : ''}`}
              value={formData.totalBudget || ''}
              onChange={handleInputChange}
              aria-required="true"
              aria-invalid={Boolean(errors.totalBudget)}
              aria-describedby={errors.totalBudget ? 'totalBudget-error' : undefined}
            />
            {errors.totalBudget && (
              <span id="totalBudget-error" className={styles.errorMessage} role="alert">
                {errors.totalBudget}
              </span>
            )}
          </div>

          <div className={styles.grid2}>
            {/* Theme & Style */}
            <div className={styles.formGroup}>
              <label htmlFor="themePreferences" className={styles.label}>
                Theme / Aesthetic Preferences
              </label>
              <input
                type="text"
                id="themePreferences"
                name="themePreferences"
                className={styles.input}
                placeholder="e.g. Royal Rajasthani, Pastel Bohemian, Retro Disco"
                value={formData.themePreferences}
                onChange={handleInputChange}
                maxLength={300}
              />
            </div>

            {/* Dietary Needs */}
            <div className={styles.formGroup}>
              <label htmlFor="dietaryNeeds" className={styles.label}>
                Dietary & Catering Needs
              </label>
              <input
                type="text"
                id="dietaryNeeds"
                name="dietaryNeeds"
                className={styles.input}
                placeholder="e.g. Pure Veg, Jain live counters, Gluten-free"
                value={formData.dietaryNeeds}
                onChange={handleInputChange}
                maxLength={200}
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div className={styles.formGroup}>
            <label htmlFor="additionalNotes" className={styles.label}>
              Special Requirements or Traditions
            </label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              rows={2}
              className={styles.textarea}
              placeholder="e.g. Need sound system for live sangeet performances, fireworks at 9 PM"
              value={formData.additionalNotes}
              onChange={handleInputChange}
              maxLength={500}
            />
          </div>
        </fieldset>

        {/* Submit Button */}
        <div className={styles.submitWrap}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isGenerating}
            aria-busy={isGenerating}
          >
            {isGenerating ? (
              <>
                <span className={styles.submitSpinner} aria-hidden="true" />
                <span>Engineering Celebration Plan...</span>
              </>
            ) : (
              <>
                <span>✨ Generate Full Celebration Plan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};
