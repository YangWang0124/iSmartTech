# Alarm feature verification — 3 September 2026

Scope: concise, visible features for the eight Paradox and six Arrowhead kits, with matching communication and service information on the three Paradox panel pages. Prices, categories, included equipment, images and short-only layout are unchanged.

## Paradox MG5050 and original SP5500

The user-corrected `AlarmKits/FIX/MG 5050.pdf` and `AlarmKits/FIX/SP5500.pdf` are the model-specific source sheets. These are original panels, not MG5050+/SP5500+ boards. Do not carry over plus-model serial-port or communication-speed specifications.

- MG5050: four-wire bus/15 keypads, programming access, monitoring numbers, daylight-saving adjustment, power reset, 256-event memory and 9.6 kbaud WinLoad communication are already covered and retained.
- SP5500: the supplied sheet supports the four-wire bus, 256-event history, installer/master/maintenance programming, monitoring numbers, daylight-saving adjustment, software reset and 9.6 kbaud direct connection. These are exposed in kit features without repeating the equipment list.

## SP4000

- [Paradox Spectra comparison](https://www.paradox.com/Products/CAT_SPECTRA/Description.asp?CATID=6): SP4000 event buffer is 256; IP150+, PCS and VDMP3 are supported. The overview describes keypad-menu and BabyWare programming.
- [Supplier SP4000 listing](https://www.alarmwarehouse.co.nz/products/alarm-controllers-and-expander-boards/paradox/paradox-spectra-sp4000-board-only/): programming access levels, monitoring numbers, daylight-saving adjustment, software reset and BabyWare.
- Do not add the supplier's 16-PGM claim: it conflicts with the manufacturer comparison. The previous request to omit the disputed 12-PGM wording remains respected.

## Internet modules — all three panels and related kits

- [Paradox IP150+](https://www.paradox.com/Products/CAT_GSMIPVOICE/IP.asp?CATID=3&SUBCATID=38): legacy IP150+ supports Spectra SP and MG5050, with Insite GOLD connectivity.
- [Paradox IP180 manual](https://www.paradox.com/Manuals/IP180.pdf), introduction: supports plus panels and most Paradox panels produced after 2012; IP180 uses BlueEye, not Insite GOLD. This is not an unconditional guarantee for every revision of an older panel.
- [Current manufacturer communication devices](https://www.paradox.com/Products/CAT_MQTTCOMM/Devices.asp?CATID=271&SUBCATID=316): MQTT IP150+ firmware also uses BlueEye. App choice must match the module firmware.

Customer-facing wording therefore identifies optional modules, keeps IP180 conditional on the exact panel/firmware, and distinguishes BlueEye from Insite GOLD.

## Arrowhead EC — all six kits

- [Supplier EC kit specification](https://www.alarmwarehouse.co.nz/products/alarm-kits-hardwired/arrowhead/arrowhead-ec-alarm-with-led-keypad-detectors-sirens-and-cable/): up to 32 doors, 2,000 total users including 1,900 wireless users, a combined maximum of 32 alarm/access keypads/readers, fused 13.8V DC/1A accessory supply, monitored 12V outputs 1/2, voltage-free relay output 4, and up to 32 Infinity wireless output modules.
- [AAP Infinity catalogue](https://www.aap.co.nz/site/aap/Infinity%20Series%20EliteControl%20Catalogue%202023.pdf): confirms the EC-PCB platform, modular access control, 2,000-user capacity, 32-output platform, EC-O4 and Infinity expansion. It does not individually verify every supplier electrical rating; the supplier specification remains the source for those exact ratings.
- Expansion capacities describe supported systems, not equipment supplied in the base kit. Access equipment, wireless links and expansion modules are optional.

Wording is paraphrased and grouped by capability. No full-details section or colour selector is added.
