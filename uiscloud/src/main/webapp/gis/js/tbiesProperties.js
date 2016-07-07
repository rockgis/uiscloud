var unitPrice = {
	// T 공통단가(단위: 만원)
	commonForSKT: 20, 
	// T 기설접속단가(단위: 만원)
	legacyConnectForSKT: 1,
	// T 신설포설단가(단위: 만원)
	newForSKT: 0.7, 
	
	// B 공통단가(단위: 만원)
	commonForSKB: 20, 
	// B 기설접속단가(단위: 만원)
	legacyConnectForSKB: 1,
	// B 신설포설단가(단위: 만원)
	newForSKB: 0.7, 
	
//	// SKT 투자비 산출(T접속코어수(단위: 갯수), SK케이블라인개수(단위: 갯수), KE라인거리(단위: 미터))
//	calculateInvestmentForSKT: function(useCoreCount, cableCountForSKT, totalLengthForKE) {
//		var that = this;
//		
//		// SKT 케이블이 없는 경우 투자비 없음
//		if(cableCountForSKT == 0) return 0;
//
//		// (T공통단가 + T기설접속단가 * 접속코어수) * (SK케이블라인개수 + 1) + T신설포설단가 * (KE라인거리)
//		var result = (that.commonForSKT + that.legacyConnectForSKT * useCoreCount) * (cableCountForSKT + 1) + that.newForSKT * (totalLengthForKE);		
//		
//		// 만원 이하 절삭
//		return Math.floor(result);
//	},
	
	// SKT 투자비 산출(T접속코어수(단위: 갯수), SK케이블라인 cost의 합, KE라인거리(단위: 미터))
	calculateInvestmentForSKT: function(cableCountForSKT, useCoreCount, cableCostSumForSKT, totalLengthForKE) {
		var that = this;
		
		// 기설 + 신설
		// 기설 = (T공통단가 + T기설접속단가 * 접속코어수) * (SK케이블라인 cost의 합 + 1)
		// 신설 = T신설포설단가 * (KE라인거리)
		// (T공통단가 + T기설접속단가 * 접속코어수) * (SK케이블라인 cost의 합 + 1) + T신설포설단가 * (KE라인거리)
		//var result = (that.commonForSKT + that.legacyConnectForSKT * useCoreCount) * (cableCostSumForSKT + 1) + that.newForSKT * (totalLengthForKE);		
		var result = (that.commonForSKT + that.legacyConnectForSKT) * (cableCostSumForSKT + 1) + that.newForSKT * (totalLengthForKE);		
		
		// 만원 이하 절삭
		return Math.floor(result);
	},	
	
	// SKT 임차비 산출(B케이블길이 합(단위: 미터), B접속코어수(단위: 갯수))
	calculateRentForSKT: function(totalLengthForSKB, useCoreCount) {
		var that = this;
		
		// SKB거리합 * 접속코어수 * 0.062	
		//var result = totalLengthForSKB * useCoreCount * 0.062;
		var result = totalLengthForSKB * 0.062;

		// 만원 이하 절삭
		return Math.floor(result);
	},	
	
//	// SKB 투자비 산출(B접속코어수(단위: 갯수), HT케이블라인개수(단위: 갯수), KE라인거리(단위: 미터))
//	calculateInvestmentForSKB: function(useCoreCount, cableCountForSKB, totalLengthForKE) {
//		var that = this;
//		
//		// SKB 케이블이 없는 경우 투자비 없음
//		if(cableCountForSKB == 0) return 0;
//		
//		// (B공통단가 + B기설접속단가 * B접속코어수) * (HT케이블라인개수 + 1) + B신설포설단가 * (KE라인거리)
//		var result = (that.commonForSKB + that.legacyConnectForSKB * useCoreCount) * (cableCountForSKB + 1) + that.newForSKB * (totalLengthForKE);		
//
//		// 만원 이하 절삭
//		return Math.floor(result);
//	},	
	
	// SKB 투자비 산출(B접속코어수(단위: 갯수), HT케이블라인 cost의 합, KE라인거리(단위: 미터))
	calculateInvestmentForSKB: function(cableCountForSKB, useCoreCount, cableCostSumForSKB, totalLengthForKE) {
		var that = this;
		
		// 기설 + 신설
		// 기설 = (B공통단가 + B기설접속단가 * B접속코어수) * (HT케이블라인 cost의 합 + 1)
		// 신설 = B신설포설단가 * (KE라인거리)
		// (B공통단가 + B기설접속단가 * B접속코어수) * (HT케이블라인 cost의 합 + 1) + B신설포설단가 * (KE라인거리)
		//var result = (that.commonForSKB + that.legacyConnectForSKB * useCoreCount) * (cableCostSumForSKB + 1) + that.newForSKB * (totalLengthForKE);
		var result = (that.commonForSKB + that.legacyConnectForSKB) * (cableCostSumForSKB + 1) + that.newForSKB * (totalLengthForKE);		

		// 만원 이하 절삭
		return Math.floor(result);
	},
	
	// SKB 임차비 산출(T케이블길이 합(단위: 미터), T접속코어수(단위: 갯수))
	calculateRentForSKB: function(totalLengthForSKT, useCoreCount) {
		var that = this;
		
		// SKT거리합 * 접속코어수 * 0.062
		//var result = totalLengthForSKT * useCoreCount * 0.062;
		var result = totalLengthForSKT * 0.062;

		// 만원 이하 절삭
		return Math.floor(result);
	} 
};