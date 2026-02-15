export namespace main {
	
	export class LocationResult {
	    city: string;
	    country: string;
	    latitude: number;
	    longitude: number;
	
	    static createFrom(source: any = {}) {
	        return new LocationResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.city = source["city"];
	        this.country = source["country"];
	        this.latitude = source["latitude"];
	        this.longitude = source["longitude"];
	    }
	}
	export class PrayerTimesResult {
	    fajr: string;
	    dhuhr: string;
	    asr: string;
	    maghrib: string;
	    isha: string;
	    hijriDay: string;
	    hijriMonth: string;
	    hijriYear: string;
	
	    static createFrom(source: any = {}) {
	        return new PrayerTimesResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.fajr = source["fajr"];
	        this.dhuhr = source["dhuhr"];
	        this.asr = source["asr"];
	        this.maghrib = source["maghrib"];
	        this.isha = source["isha"];
	        this.hijriDay = source["hijriDay"];
	        this.hijriMonth = source["hijriMonth"];
	        this.hijriYear = source["hijriYear"];
	    }
	}

}

