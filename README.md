터미널 콘솔 창에서 플레이 가능한 텍스트 로그라이크 RPG를 만들어보자.

이미 틀(스켈레톤) 코드가 짜여진 곳에 기능만 구현해보자.

게임 설명 
        1. 속도, 명중률과 회피율이 구현되어있는 게임입니다!
        2. 스탯에는 각각의 공식이 있습니다.
                a. 스피드 : 높은 쪽이 선공권을 가져갑니다. (몬스터는 자동공격합니다!)
                b. 회피율 : 회피율이 높을수록 공격을 회피할 확률이 높아집니다.
                c. 명중률 : 명중률이 회피율과 같거나 높다면 공격은 반드시 명중합니다.
                        회피율 공식 : ((회피스탯(AVD) - 명중스탯(ACC)) * 10)%
                                .부연설명 : 회피(AVD)가 명중(ACC)보다 높다면 그 수치 1 당 10%의 회피율이 적용됩니다. (10이상일 경우 완전회피)
        3. 연속공격이 추가되었습니다.
                a. 이에 따라 마나스탯이 플레이어에게 추가되었습니다. (스킬 사용시 소모)
                b. 마나가 부족하다면 스킬을 사용할 수 없습니다.
                c. 마나는 스테이지 클리어시 재충전됩니다.
                d. 연속공격스킬은 공격을 2회 시전하는 스킬입니다.
        4. 스테이지가 올라갈수록 난이도가 상승합니다.
                a. 스테이지가 상승하면 몬스터의 회피율이 올라갑니다...
                b. 당신의 운으로 게임에서 승리하세요.
                
목표     1. 몬스터와 플레이어의 상호작용 (공격 - 피격)
        2. 여러 선택지 만들어보기 (스킬구현, 도망치기, 공격하기, 아이템사용하기(포션 등) )
        3. 못 하더라도 최소한 게임이라는 것은 보여주기 (실행되는 것이랑 종료되는 것까지는 해봐야...)
