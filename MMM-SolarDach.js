/* Magic Mirror
* Module: MMM-SolarDach
* By tbbear
*/

Module.register("MMM-SolarDach", {

		// Module config defaults.
		defaults: {
			updateInterval: 30 * 60 * 1000, // every 10 minutes
			url: "http://192.168.2.92/rest/solarworld/lpvm/powerAndBatteryData",
			initialLoadDelay: 300, //  delay
			retryDelay: 1500,
			maxWidth: "100%",
		},

		// Define required scripts.
		getScripts: function() {
			return ["moment.js"];
		},

		getTranslations: function() {
			return {
				en: "translations/en.json",
				de: "translations/de.json"
			};
		},
	
		getStyles: function() {
			return ["MMM-SolarDach.css", "font-awesome.css"];
		},



		// Define start sequence.
		start: function() {
			Log.info("Starting module: " + this.name);
			this.config.lang = this.config.lang || config.language; //automatically overrides and sets language :)
			this.sendSocketNotification("CONFIG", this.config);

			// Set locale.  
			var lang = config.language;
			this.solar = {};
			this.scheduleUpdate();
		},

		processSolar: function(data) {
			this.solar = data;
			this.loaded = true;
		},

		scheduleUpdate: function() {
			setInterval(() => {
					this.getSolar();
				}, this.config.updateInterval);
			this.getSolar(this.config.initialLoadDelay);
		},

		getSolar: function() {
			this.sendSocketNotification("GET_Solar", this.config.url);
		},

		socketNotificationReceived: function(notification, payload) {
			if (notification === "Solar_RESULT") {
				this.processSolar(payload);
			}
			this.updateDom();
		},

		getDom: function() {

			var wrapper = document.createElement("div");
			wrapper.style.maxWidth = this.config.maxWidth;

			if (!this.loaded) {
				wrapper.classList.add("small", "bright");
				wrapper.innerHTML = this.translate("Reading Solar Results...");
				return wrapper;
			}

			var Header = document.createElement("header");
			Header.classList.add("xsmall", "bright", "align-left", "header");
			Header.innerHTML = this.translate("Solar Results:");
			wrapper.appendChild(Header);

			var l4 = document.createElement("div");
			l4.classList.add("xsmall", "align-left", "line");
			l4.innerHTML = this.translate("Power Total: ") + this.solar.PowerTotalPV.toFixed(2) + " kWh<br>";
			wrapper.appendChild(l4);

			var l6 = document.createElement("div");
			l6.classList.add("xsmall", "align-left", "line");
			l6.innerHTML = this.translate("Power In: ") + this.solar.PowerIn.toFixed(2) + " kWh<br>";
			wrapper.appendChild(l6);

			var l1 = document.createElement("div");
			l1.classList.add("xsmall", "align-left", "line");
			l1.innerHTML = this.translate("Power SelfConsumption: ") + this.solar.PowerSelfConsumption.toFixed(2) + " kWh<br>";
			wrapper.appendChild(l1);
			
			var l2 = document.createElement("div");
			l2.classList.add("xsmall", "align-left", "line");
			l2.innerHTML = this.translate("Power Consumption: ") + this.solar.PowerConsumption.toFixed(2) + " kWh<br>";
			wrapper.appendChild(l2);

			return wrapper;
		}
});