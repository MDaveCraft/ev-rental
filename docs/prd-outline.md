# **PRODUCT REQUIREMENT DOCUMENT (PRD)**

## **HYMN EV Rentals – Intelligent EV Mobility Ecosystem**

**Version 1.0 — October 2025**

---

# **1. Product Overview**

### **1.1 Summary**

HYMN EV Rentals is an intelligent, cloud-native EV rental platform that bridges the gap between EV availability, charging infrastructure, user education, and trip reliability in India. Built on a **contractor-based fleet**, **AI-driven trip orchestration**, **smart charging reservations**, and **Beckn open-network interoperability**, the platform aims to become India’s EV mobility backbone.

### **1.2 Problem Statement**

India’s EV adoption is hindered by:

* High EV ownership cost
* Range anxiety (40% of potential users)
* Limited & fragmented charging infrastructure
* Low first-time EV confidence
* Rental platforms with minimal EV support
* Closed ecosystems with no interoperability

Users need a **predictable, reliable EV rental experience**, contractors need **sustainable earnings**, and mobility ecosystems need **open access** to EV supply.

### **1.3 Product Vision**

To deliver India’s most **intelligent, predictive, open-network EV rental ecosystem** that guarantees trip success and scales without owning vehicles.

### **1.4 Success Metrics (KPIs)**

* **>95% trip success rate**
* **<2 min booking flow completion**
* **>90% route prediction accuracy**
* **40% reduction in fleet downtime**
* **20% MoM contractor supply growth**
* **70%+ charging reservation utilization**
* **CAC approaching zero via Beckn integrations**

---

# **2. Goals and Non-Goals**

### **2.1 Goals**

* Provide seamless booking, charging, and trip management for EV rentals.
* Enable contractor-based fleet scaling without CapEx.
* Deliver predictive intelligence via AI Co-Pilot for route planning, charger selection, and real-time support.
* Integrate India’s public/private charging networks with unified payment.
* Enable cross-platform discoverability via Beckn protocol.
* Support IoT-driven predictive maintenance and V2G revenue models.

### **2.2 Non-Goals**

* HYMN will **not** manufacture EVs.
* HYMN will **not** deploy proprietary charging stations.
* HYMN will **not** operate a fully owned fleet (beyond internal QA/testing).
* Autonomous vehicles are **future roadmap**, not Phase 1.

---

# **3. User Personas**

### **Persona 1: Urban Commuter (Primary User)**

* Needs reliable, affordable EV access for short/medium trips.
* Pain points: range anxiety, charging confusion, platform fragmentation.

### **Persona 2: Tourist / Long-Distance Traveler**

* Needs charging guarantees and route planning.
* Pain points: uncertainty around charger availability.

### **Persona 3: Gig Worker (Delivery / Rideshare)**

* Needs low-cost daily/weekly rentals and predictable range.
* Pain points: downtime impacts income.

### **Persona 4: Contractor (EV Owner/Partner)**

* Wants predictable earnings and minimal operational overhead.
* Pain points: vehicle downtime, low utilization.

### **Persona 5: Enterprise Mobility Manager**

* Needs employee mobility, ESG reporting, fleet visibility.

---

# **4. Scope & Features**

## **4.1 Core User Features**

### **4.1.1 EV Discovery & Booking**

**Requirements:**

* Search by location, duration, vehicle type, price.
* Hyper-accurate range predictions using AI.
* Real-time availability synced with contractor supply.
* One-tap booking with UPI/credit/Beckn-supported checkout.

**Priority:** P0
**Acceptance Criteria:**

* Users complete booking in <120 seconds.
* Availability reflects >99% accuracy.

---

### **4.1.2 Proactive AI Co-Pilot**

**Requirements:**

* Calendar-based booking suggestions.
* Predictive route planning with charger stops.
* Real-time assistance: SOC alerts, regen tips, congestion warnings.
* Multilingual (10+ languages), voice + text.

**Priority:** P0
**Acceptance Criteria:**

* 90% route prediction accuracy.
* 85% of long-distance trips auto-optimized with charging stops.

---

### **4.1.3 Integrated Smart Charging**

**Requirements:**

* Unified map of 25,000+ chargers.
* Smart charging reservations with time-slot locking.
* Charger load prediction for peak times.
* Unified payment and CPO (Charge Point Operator) settlement.

**Priority:** P0
**Acceptance Criteria:**

* <2% charging reservation failure rate.

---

### **4.1.4 EV Education Hub**

**Requirements:**

* Interactive tutorials for new users.
* Virtual EV Simulator (regen, SOC management, charging steps).
* Gamified badges with rental discounts.

**Priority:** P1
**Acceptance Criteria:**

* 60% completion rate for EV Basics module.

---

## **4.2 Contractor-Facing Features**

### **4.2.1 Contractor Onboarding**

**Requirements:**

* Instant KYC, vehicle verification.
* Listing rules, pricing models, insurance integration.
* Dashboard for utilization, earnings, and maintenance alerts.

**Priority:** P0

---

### **4.2.2 Predictive Fleet Health**

**Requirements:**

* IoT telemetry ingestion (MQTT).
* Battery/cell imbalance detection.
* Tire pressure, brake wear, motor temperature insights.
* Automatic booking-block when safety issues detected.

**Priority:** P0

---

### **4.2.3 V2G Participation**

**Requirements:**

* Contractors opt into grid discharge programs.
* Revenue computation, compliance rules, battery protection thresholds.

**Priority:** P2 (Future Pilot)

---

## **4.3 Enterprise & Open Ecosystem Features**

### **4.3.1 Beckn Protocol Integration**

**Requirements:**

* Act as Beckn Provider Platform (BPP).
* Translate Beckn search/select/confirm calls.
* Ensure idempotency, signing, callbacks.

**Priority:** P0

---

### **4.3.2 ESG & Carbon Footprint Reporting**

**Requirements:**

* Carbon savings per trip.
* Corporate dashboards.
* Future: carbon credit marketplace.

**Priority:** P2

---

# **5. Technical Requirements**

## **5.1 Architecture**

* Microservices with DDD boundaries
* Kafka event backbone
* CQRS/ES for bookings and telemetry
* IoT ingestion via MQTT
* gRPC internal service communication
* Redis → command cache
* Elasticsearch → availability search
* Timescale/InfluxDB → telemetry
* PostgreSQL → transactional data
* Multi-cloud region redundancy

---

# **6. Dependencies**

* Charging network partners (CPO APIs)
* Identity verification providers (Aadhaar/DL KYC)
* Payment processors (UPI, Razorpay, Stripe)
* Beckn network (BAP partners)
* EV OEM telematics integrations

---

# **7. Risks & Mitigations**

| Risk                     | Impact                    | Mitigation                         |
| ------------------------ | ------------------------- | ---------------------------------- |
| Charger API downtime     | Trip failures             | Redundancy + fallback routing      |
| Contractor unreliability | Bad user experience       | Rating + dynamic prioritization    |
| Poor telemetry           | Incorrect SOC predictions | Edge buffering + sensor validation |
| Regulatory shifts        | Compliance risk           | Modular compliance engine          |

---

# **8. Rollout Plan**

### **Phase 1 (0–6 months):**

* Bengaluru + Pune
* 150 EVs
* AI Co-Pilot v1
* Charging integration v1

### **Phase 2 (6–18 months):**

* 5 metros
* 800 EVs
* Beckn integrations live
* Enterprise dashboards

### **Phase 3 (18–36 months):**

* National expansion
* 5,000 EVs
* V2G pilot
* Carbon reporting

---

# **9. Acceptance Criteria for MVP**

* Booking system stable at 10k concurrent users
* 90%+ trip success rate
* Charging reservation integrated with at least 5 major CPOs
* Contractor onboarding <10 minutes
* Co-Pilot functional for route planning
