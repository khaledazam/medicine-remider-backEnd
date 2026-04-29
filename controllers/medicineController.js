// controllers/medicineController.js
import Medicine from "../models/Medicine.js";

//  1) Add Medicine
export const addMedicine = async (req, res) => {
  try {
    const { name, dosage, schedule, notes, quantity, refillAlertAt } = req.body;

    if (!name || !dosage || !schedule || schedule.length === 0) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const medicine = await Medicine.create({
      user: req.user._id,
      name,
      dosage,
      schedule,
      notes: notes || "",
      quantity: quantity || 0,
      refillAlertAt: refillAlertAt || 5,
    });

    res.status(201).json({ message: "Medicine added", medicine });
  } catch (error) {
  console.error("🔥 Error in addMedicine:", error.message);
  console.error(error.stack); // هيوضح مكان الخطأ بالضبط
  res.status(500).json({ 
    message: "Server error while adding medicine", 
    error: error.message 
  });
}

};

//  2) Edit Medicine
export const editMedicine = async (req, res) => {
  try {
    console.log("🔵 Edit Medicine called");
    console.log("📦 Medicine ID:", req.params.id);
    console.log("👤 User ID:", req.user._id);
    console.log("✏️ Update data:", req.body);

    // Validation: تأكد إن في حقول للتحديث
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log("❌ No data provided for update");
      return res.status(400).json({ message: "No data provided for update" });
    }

    // تأكد إن الـ ID صحيح
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log("❌ Invalid medicine ID format");
      return res.status(400).json({ message: "Invalid medicine ID" });
    }

    console.log(" Updating medicine...");
    
    const medicine = await Medicine.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!medicine) {
      console.log("❌ Medicine not found");
      return res.status(404).json({ message: "Medicine not found" });
    }

    console.log("✅ Medicine updated:", medicine);
    res.json({ message: "Medicine updated", medicine });

  } catch (error) {
    console.error("🔥 Error in editMedicine:", error.message);
    console.error("📋 Full error:", error);
    res.status(500).json({ 
      message: "Server error while editing medicine",
      error: error.message 
    });
  }
};

//  3) Delete Medicine
export const deleteMedicine = async (req, res) => {
  try {
    console.log("🔵 Delete Medicine called");
    console.log("📦 Medicine ID:", req.params.id);
    console.log("👤 User ID:", req.user._id);

    // Validation: تأكد من صيغة الـ ID
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log("❌ Invalid medicine ID format");
      return res.status(400).json({ message: "Invalid medicine ID" });
    }

    console.log("🔄 Deleting medicine...");
    
    const medicine = await Medicine.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!medicine) {
      console.log("❌ Medicine not found");
      return res.status(404).json({ message: "Medicine not found" });
    }

    console.log("✅ Medicine deleted:", medicine.name);
    res.json({ 
      message: "Medicine deleted successfully",
      deletedMedicine: medicine 
    });

  } catch (error) {
    console.error("🔥 Error in deleteMedicine:", error.message);
    console.error("📋 Full error:", error);
    res.status(500).json({ 
      message: "Server error while deleting medicine",
      error: error.message 
    });
  }
};

//  4) Get All Medicines
export const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ user: req.user._id });
    res.json(medicines);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching medicines" });
  }
};

//  5) Mark Dose as Taken
export const markDoseTaken = async (req, res) => {
  try {
    console.log("🔵 Mark Dose Taken called");
    console.log("📦 Medicine ID:", req.params.id);
    console.log("👤 User ID:", req.user._id);
    console.log("⏰ Time:", req.body.time);

    // Validation: تأكد من الـ time موجود
    if (!req.body.time) {
      console.log("❌ Time not provided");
      return res.status(400).json({ message: "Time is required" });
    }

    // Validation: صيغة الـ ID
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log("❌ Invalid medicine ID format");
      return res.status(400).json({ message: "Invalid medicine ID" });
    }

    console.log("🔍 Finding medicine...");
    const medicine = await Medicine.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!medicine) {
      console.log("❌ Medicine not found");
      return res.status(404).json({ message: "Medicine not found" });
    }

    console.log("📝 Adding to history...");
    medicine.history = medicine.history || [];
    
    // تأكد من عدم تسجيل نفس الـ dose مرتين في نفس اليوم
    const today = new Date().toDateString();
    const alreadyTaken = medicine.history.some(h => 
      new Date(h.date).toDateString() === today && h.time === req.body.time
    );

    if (alreadyTaken) {
      console.log("⚠️ Dose already marked as taken today");
      return res.status(400).json({ message: "This dose is already marked as taken today" });
    }

    medicine.history.push({ 
      time: req.body.time, 
      date: new Date(), 
      taken: true 
    });

    // تقليل الكمية
    if (medicine.quantity > 0) {
      medicine.quantity -= 1;
      console.log("📉 Quantity decreased to:", medicine.quantity);
    }

    await medicine.save();
    console.log("✅ Dose marked as taken");
    
    res.json({ 
      message: "Dose marked as taken successfully", 
      medicine,
      remainingQuantity: medicine.quantity
    });

  } catch (error) {
    console.error("🔥 Error in markDoseTaken:", error.message);
    console.error("📋 Full error:", error);
    res.status(500).json({ 
      message: "Error updating dose history",
      error: error.message 
    });
  }
};

//  6) Missed Dose Detection
export const getMissedDoses = async (req, res) => {
  try {
    console.log("🔵 Get Missed Doses called");
    console.log("👤 User ID:", req.user._id);

    console.log("🔍 Fetching all medicines...");
    const medicines = await Medicine.find({ user: req.user._id });
    console.log(`📦 Found ${medicines.length} medicines`);

    const missed = [];
    const today = new Date().toDateString();
    console.log("📅 Today:", today);

    medicines.forEach(med => {
      console.log(`\n💊 Checking ${med.name}...`);
      console.log(`   Schedule: ${med.schedule.join(", ")}`);
      console.log(`   History count: ${(med.history || []).length}`);

      med.schedule.forEach(scheduledTime => {
        // Check if this dose was taken today
        const taken = (med.history || []).some(h => 
          new Date(h.date).toDateString() === today && 
          h.time === scheduledTime && 
          h.taken === true
        );

        if (!taken) {
          console.log(`   ❌ MISSED: ${scheduledTime}`);
          missed.push({
            medicineId: med._id,
            medicineName: med.name,
            dosage: med.dosage,
            scheduledTime: scheduledTime,
            date: today,
            message: `You missed your ${scheduledTime} dose for ${med.name} (${med.dosage}).`
          });
        } else {
          console.log(`   ✅ TAKEN: ${scheduledTime}`);
        }
      });
    });

    console.log(`\n📊 Total missed doses: ${missed.length}`);
    res.json({
      totalMissed: missed.length,
      missedDoses: missed,
      date: today
    });

  } catch (error) {
    console.error("🔥 Error in getMissedDoses:", error.message);
    console.error("📋 Full error:", error);
    res.status(500).json({ 
      message: "Error checking missed doses",
      error: error.message 
    });
  }
};

//  7) Refill Alerts
export const getRefillAlerts = async (req, res) => {
  try {
    console.log("🔵 Get Refill Alerts called");
    console.log("👤 User ID:", req.user._id);

    console.log("🔍 Fetching all medicines...");
    const medicines = await Medicine.find({ user: req.user._id });
    console.log(`📦 Found ${medicines.length} medicines`);

    const alerts = medicines
      .filter(m => {
        const threshold = m.refillAlertAt || 5;
        const isLow = m.quantity <= threshold;
        
        if (isLow) {
          console.log(`⚠️ ${m.name}: ${m.quantity} left (threshold: ${threshold})`);
        } else {
          console.log(`✅ ${m.name}: ${m.quantity} left (threshold: ${threshold})`);
        }
        
        return isLow;
      })
      .map(m => ({
        medicineId: m._id,
        medicineName: m.name,
        dosage: m.dosage,
        currentQuantity: m.quantity,
        refillThreshold: m.refillAlertAt || 5,
        urgency: m.quantity === 0 ? "CRITICAL" : "WARNING",
        message: m.quantity === 0 
          ? `⛔ ${m.name} is OUT OF STOCK!` 
          : `⚠️ Your stock for ${m.name} is low (${m.quantity} left, refill at ${m.refillAlertAt || 5}).`
      }));

    console.log(`\n📊 Total alerts: ${alerts.length}`);
    
    res.json({
      totalAlerts: alerts.length,
      alerts: alerts,
      criticalCount: alerts.filter(a => a.urgency === "CRITICAL").length
    });

  } catch (error) {
    console.error("🔥 Error in getRefillAlerts:", error.message);
    console.error("📋 Full error:", error);
    res.status(500).json({ 
      message: "Error checking refill alerts",
      error: error.message 
    });
  }
};
//  8) Daily Summary
export const getDailySummary = async (req, res) => {
  try {
    console.log("🔵 Get Daily Summary called");
    console.log("👤 User ID:", req.user._id);

    console.log("🔍 Fetching all medicines...");
    const medicines = await Medicine.find({ user: req.user._id });
    console.log(`📦 Found ${medicines.length} medicines`);

    const today = new Date().toDateString();
    console.log(`📅 Today: ${today}`);

    const summary = medicines.map(med => {
      const taken = (med.history || []).filter(h => 
        new Date(h.date).toDateString() === today && h.taken === true
      );

      const total = med.schedule.length;
      const takenCount = taken.length;
      const missed = total - takenCount;
      const adherence = total > 0 ? Math.round((takenCount / total) * 100) : 0;

      console.log(`\n💊 ${med.name}:`);
      console.log(`   Total doses: ${total}`);
      console.log(`   Taken: ${takenCount}`);
      console.log(`   Missed: ${missed}`);
      console.log(`   Adherence: ${adherence}%`);

      return {
        medicineId: med._id,
        medicineName: med.name,
        dosage: med.dosage,
        schedule: med.schedule,
        taken: takenCount,
        total: total,
        missed: missed,
        adherence: adherence,
        status: adherence === 100 ? "✅ Perfect" : adherence >= 50 ? "⚠️ Partial" : "❌ Poor",
        takenTimes: taken.map(t => t.time)
      };
    });

    // حساب الملخص الكلي
    const totalDoses = summary.reduce((sum, m) => sum + m.total, 0);
    const totalTaken = summary.reduce((sum, m) => sum + m.taken, 0);
    const totalMissed = summary.reduce((sum, m) => sum + m.missed, 0);
    const overallAdherence = totalDoses > 0 ? Math.round((totalTaken / totalDoses) * 100) : 0;

    console.log(`\n📊 Daily Summary:`);
    console.log(`   Total doses: ${totalDoses}`);
    console.log(`   Taken: ${totalTaken}`);
    console.log(`   Missed: ${totalMissed}`);
    console.log(`   Overall adherence: ${overallAdherence}%`);

    res.json({
      date: today,
      medicines: summary,
      dailyStats: {
        totalDoses: totalDoses,
        totalTaken: totalTaken,
        totalMissed: totalMissed,
        overallAdherence: overallAdherence,
        status: overallAdherence === 100 ? "✅ Perfect Day!" : overallAdherence >= 50 ? "⚠️ Good Progress" : "❌ Need Improvement"
      }
    });

  } catch (error) {
    console.error("🔥 Error in getDailySummary:", error.message);
    console.error("📋 Full error:", error);
    res.status(500).json({ 
      message: "Error generating daily summary",
      error: error.message 
    });
  }
};

//  9) 30-day Calendar Schedule
export const getCalendarSchedule = async (req, res) => {
  try {
    console.log("🔵 Get Calendar Schedule called");
    console.log("👤 User ID:", req.user._id);

    console.log("🔍 Fetching all medicines...");
    const medicines = await Medicine.find({ user: req.user._id });
    console.log(`📦 Found ${medicines.length} medicines`);

    const calendar = [];
    const today = new Date();
    console.log(`📅 Starting from: ${today.toDateString()}`);

    // Generate 30-day schedule
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateString = date.toDateString();

      medicines.forEach(m => {
        m.schedule.forEach(t => {
          // Check if this dose was taken
          const taken = (m.history || []).some(h =>
            new Date(h.date).toDateString() === dateString &&
            h.time === t &&
            h.taken === true
          );

          calendar.push({
            date: dateString,
            fullDate: date,
            medicine: m.name,
            medicineId: m._id,
            dosage: m.dosage,
            scheduledTime: t,
            taken: taken,
            status: taken ? "✅ Taken" : dateString === today.toDateString() ? "⏳ Today" : "⭕ Pending"
          });
        });
      });
    }

    // Sort by date and time
    calendar.sort((a, b) => {
      const dateA = new Date(a.fullDate);
      const dateB = new Date(b.fullDate);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      return a.scheduledTime.localeCompare(b.scheduledTime);
    });

    console.log(`📊 Generated ${calendar.length} schedule entries for 30 days`);
    console.log(`   Taken: ${calendar.filter(c => c.taken).length}`);
    console.log(`   Pending: ${calendar.filter(c => !c.taken).length}`);

    res.json({
      period: {
        startDate: today.toDateString(),
        endDate: new Date(today.getTime() + 29 * 24 * 60 * 60 * 1000).toDateString(),
        days: 30
      },
      totalSchedules: calendar.length,
      stats: {
        taken: calendar.filter(c => c.taken).length,
        pending: calendar.filter(c => !c.taken).length
      },
      schedule: calendar
    });

  } catch (error) {
    console.error("🔥 Error in getCalendarSchedule:", error.message);
    console.error("📋 Full error:", error);
    res.status(500).json({
      message: "Error generating calendar",
      error: error.message
    });
  }
};

//  10) Upload Prescription Image
export const uploadPrescription = async (req, res) => {
  try {
    console.log("🔵 Upload Prescription called");
    console.log("📦 Medicine ID:", req.params.id);
    console.log("👤 User ID:", req.user._id);

    // Validation: تأكد من صيغة الـ ID
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log("❌ Invalid medicine ID format");
      return res.status(400).json({ message: "Invalid medicine ID" });
    }

    // Validation: تأكد من وجود الـ URL أو الـ file
    const imageUrl = req.body.url || req.file?.path;

    if (!imageUrl) {
      console.log("❌ No image provided");
      return res.status(400).json({ 
        message: "Image URL or file is required",
        hint: "Send either req.body.url (string) or upload a file"
      });
    }

    console.log("🔍 Finding medicine...");
    const medicine = await Medicine.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!medicine) {
      console.log("❌ Medicine not found");
      return res.status(404).json({ message: "Medicine not found" });
    }

    console.log("📸 Updating prescription image...");
    medicine.prescriptionImage = imageUrl;
    await medicine.save();

    console.log("✅ Prescription uploaded successfully");
    res.json({ 
      message: "Prescription uploaded successfully",
      medicine: {
        id: medicine._id,
        name: medicine.name,
        dosage: medicine.dosage,
        prescriptionImage: medicine.prescriptionImage,
        uploadedAt: medicine.updatedAt
      }
    });

  } catch (error) {
    console.error("🔥 Error in uploadPrescription:", error.message);
    console.error("📋 Full error:", error);
    res.status(500).json({ 
      message: "Error uploading prescription",
      error: error.message 
    });
  }
};