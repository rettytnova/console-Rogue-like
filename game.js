import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
  constructor() {
    this._maxHp = 100; // 최대체력
    this._hp = this._maxHp; // 체력
    this._maxMp = 1; // 최대마나
    this._mp = this._maxMp; // 마나
    this._atk = 10; // 공격력
    this._def = 1; // 방어력
    this._acc = 1; // 명중률 // 회피율보다 같거나 높다면 무조건 명중
    this._avd = 0; // 회피율 // 1 당 10% 명중률 대비 회피율이 10 이상이면 일반 공격 무효화
    this._spd = 1; // 속도 (속도가 낮으면 후공으로 시작 / 같으면 플레이어 선공)
    this._run = false; // true일 시 도망상태
  }

  get statusString() {
    // display에 띄워줄 모든 스텟을 string으로 반환한다.
    return `HP: ${this._hp} MP: ${this._mp} ATK: ${this._atk} DEF: ${this._def} ACC: ${this._acc} AVD: ${this._avd} SPD: ${this._spd}`;
  }

  get maxHp() {
    return this._maxHp;
  }
  set maxHp(maxHp) {
    this._maxHp += maxHp;
  }

  get hp() {
    return this._hp;
  }
  set hp(hp) {
    this._hp += hp;
  }

  get mp() {
    return this._mp;
  }
  get def() {
    return this._def;
  }
  set def(def) {
    this._def += def;
  }

  get atk() {
    return this._atk;
  }
  set atk(atk) {
    this._atk += atk;
  }

  get acc() {
    return this._acc;
  }
  set acc(acc) {
    this._acc += acc;
  }

  get avd() {
    return this._avd;
  }
  set avd(avd) {
    this._avd += avd;
  }

  get spd() {
    return this._spd;
  }
  set spd(spd) {
    this._spd += spd;
  }

  get state() {
    return this._run;
  }
  set state(state) {
    this._run += state;
  }

  useSkill(mp) {
    this._mp -= mp;
  }

  damaged(atk, acc) {
    // 데미지 구하기
    let dmg = 0;
    if (Math.random() * 100 < this.getAccuracy(acc, this._avd)) {
      //명중 회피 조건
      dmg = atk - this._def;
    }
    this._hp -= dmg;
    return dmg;
  }

  getAccuracy(acc, avd) {
    // 명중률 구하기
    if (avd < acc) {
      // 회피율이 명중률보다 낮은 경우
      return 0;
    } else if (avd - acc < 10) {
      // 회피율이 명중률보다 높지만 수치가 10미만인 경우
      return 100 - (avd - acc) * 10;
    } else {
      // 회피율이 명중률보다 10이상 높은 경우
      return 100;
    }
  }

  initialize() {
    this._maxHp = 100;
    this._hp = this._maxHp;
    this._maxMp = 1;
    this._mp = this._maxMp;
    this._atk = 10;
    this._def = 1;
    this._acc = 1;
    this._avd = 0;
    this._spd = 1;
    this._run = false;
  }

  recovery() {
    this._hp = this._maxHp;
    this._mp = this._maxMp;
  }

  buff(upMaxHp, upMaxMp, upAtk, upDef, upAcc, upAvd, upSpd) {
    // 스텟 영구적 상승 효과
    this._maxHp += upMaxHp;
    this._maxMp += upMaxMp;
    this._atk += upAtk;
    this._def += upDef;
    this._acc += upAcc;
    this._avd += upAvd;
    this._spd += upSpd;
  }

  run() {
    // 도망감
    this._run = true;
  }
}

class Monster {
  constructor() {
    this._maxHp = 50;
    this._hp = this._maxHp;
    this._atk = 10;
    this._def = 1;
    this._acc = 2;
    this._avd = 1;
    this._spd = 4;
  }

  get statusString() {
    return `HP: ${this._hp} ATK: ${this._atk} DEF: ${this._def} ACC: ${this._acc} AVD: ${this._avd} SPD: ${this._spd}`;
  }

  get hp() {
    return this._hp;
  }
  set hp(hp) {
    this._hp += hp;
  }

  get def() {
    return this._def;
  }
  set def(def) {
    this._def += def;
  }

  get atk() {
    return this._atk;
  }
  set atk(atk) {
    this._atk += atk;
  }

  get acc() {
    return this._acc;
  }
  set acc(acc) {
    this._acc += acc;
  }

  get avd() {
    return this._avd;
  }
  set avd(avd) {
    this._avd += avd;
  }

  get spd() {
    return this._spd;
  }
  set spd(spd) {
    this._spd += spd;
  }

  damaged(atk, acc) {
    let dmg = 0;
    if (Math.random() * 100 < this.getAccuracy(acc, this._avd)) {
      dmg = atk - this._def;
    }
    this._hp -= dmg;
    return dmg;
  }

  getAccuracy(acc, avd) {
    if (avd < acc) {
      // 회피율이 명중률보다 낮은 경우
      return 0;
    } else if (avd - acc < 10) {
      // 회피율이 명중률보다 높지만 수치가 10미만인 경우
      return 100 - (avd - acc) * 10;
    } else {
      // 회피율이 명중률보다 10이상 높은 경우
      return 100;
    }
  }

  initialize() {
    this._maxHp = 50;
    this._hp = this._maxHp;
    this._atk = 10;
    this._def = 1;
    this._acc = 2;
    this._avd = 1;
    this._spd = 4;
  }

  recovery() {
    this._hp = this._maxHp;
  }

  buff(upMaxHp, upAtk, upDef, upAcc, upAvd, upSpd) {
    // 몬스터는 스킬을 사용하지 않기 때문에 Mp 제거
    this._maxHp += upMaxHp;
    this._atk += upAtk;
    this._def += upDef;
    this._acc += upAcc;
    this._avd += upAvd;
    this._spd += upSpd;
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} |`) +
      chalk.blueBright(`\n|Player ▶ ${player.statusString} |`) +
      chalk.redBright(`\n|Monster ▶ ${monster.statusString} |`),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = []; // 전투 로그 문자열들을 담을 배열
  let dmg = 0; // 실질적으로 가하는 데미지 (플레이어 <-> 몬스터)
  let addDmg = 0; // 추가공격시 입히는 데미지
  let firstAttack = 'player'; // 선공유닛 (플레이어 혹은 몬스터)
  const skill_1_Cost = 1; // 연속공격 스킬의 스킬비용(마나 소모량)

  while (player.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);
    logs.forEach((log) => console.log(log));
    let battleSkip = false; // 잘못된 선택지를 고를 경우 배틀페이지 스킵 (몬스터나 플레이어가 공격 상호작용을 하는 것을 막기 위해)

    if (monster.hp <= 0) {
      console.log(chalk.red('몬스터를 쓰러트렸습니다!'));
      logs = [];
      break;
    }

    if (firstAttack === 'player' && player.spd < monster.spd) {
      //플레이어와 몬스터의 속도를 비교해서 몬스터가 선공권을 가져갈 경우 피격되고 시작함
      firstAttack = 'monster';
      logs.push(chalk.yellow('몬스터가 선공권을 갖습니다.'));
      dmg = player.damaged(monster.atk, monster.acc);
      if (dmg === 0) {
        logs.push(chalk.redBright(`몬스터의 공격을 회피했습니다!`));
      } else {
        logs.push(chalk.cyanBright(`(몬스터 선공)플레이어가 ${dmg}의 피해를 입었습니다.`));
      }
    }
    console.log(
      chalk.green(
        `\n1. 공격한다(명중률${player.getAccuracy(player.acc, monster.avd)}%)  2. 연속공격(Mp소모) 3. 도망간다.  4. 게임종료`,
      ),
    );
    const playerProbablityToAvoid = 100 - player.getAccuracy(monster.acc, player.avd);

    console.log(chalk.blue(`|회피확률:${playerProbablityToAvoid}%|`));

    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
    switch (choice) {
      case '1':   
        logs = [];     
        dmg = monster.damaged(player.atk, player.acc);
        if (dmg === 0) {
          logs.push(chalk.red(`플레이어가 공격을 맞추지 못했습니다.`));
        } else {
          logs.push(chalk.red(`몬스터가 ${dmg}의 피해를 입었습니다.`));
        }
        break;
      case '2':   
        logs = [];
        if (player.mp >= skill_1_Cost) {
          dmg = monster.damaged(player.atk, player.acc);
          addDmg = monster.damaged(player.atk, player.acc);
          if (dmg + addDmg === 0) {
            logs.push(chalk.red(`플레이어가 공격을 맞추지 못했습니다.`));
          } else {
            logs.push(chalk.red(`몬스터가 ${dmg}+${addDmg}의 피해를 입었습니다!`));
          }
          player.useSkill(skill_1_Cost);
        } else {
          logs.push(chalk.red(`마나가 부족합니다.`));
          battleSkip = true;
        }
        break;
      case '3':
        logs = [];
        player.run(); //스탠딩 상태 -> 도망 상태로 변경        
        break;
      case '4':
        console.log(chalk.red('게임을 종료합니다.'));
        process.exit(0); // 게임 종료
        break;
      default:
        console.log(chalk.red('올바른 선택을 하세요.'));
    }    

    if (!player.state && !battleSkip) {
      // 전투 중이고 스킬사용 마나가 부족하지 않다면 정상적으로 공격을 실행했으므로 몬스터의 턴으로 넘긴다.
      dmg = player.damaged(monster.atk, monster.acc);
      if (dmg == 0) {
        logs.push(chalk.cyanBright(`몬스터의 공격을 회피했습니다.`));
      } else {
        logs.push(chalk.cyanBright(`플레이어가 ${dmg}의 피해를 입었습니다.`));
      }
    }else if(player.state){
      // 도망갔을 경우 
        break;
    }
  }
};

export async function startGame() {
  console.clear();
  const player = new Player();
  const monster = new Monster();//몬스터도 스테이지 클리어되면 같은 객체를 재탕하기 위해 여기에 선언
  let stage = 1;

  while (stage <= 10) {
    await battle(stage, player, monster);
    // 스테이지 클리어 및 게임 종료 조건
    if (player.hp <= 0) {
      console.log(chalk.red('플레이어가 사망하였습니다.'));
      process.exit(0); // 게임 종료
    }
    player.buff(4, 1, 2, 1, 1, 1, 1); // 스테이지 클리어시 플레이어 스텟 상승
    player.recovery(); // 최대체력으로 회복 (스테이지 종료시)
    monster.buff(3, 1, 1, 0, 2, 0); // 스테이지 클리어시 몬스터 스텟도 상승
    monster.recovery(); // 몬스터도 회복시켜줘야함 (재탕해야 하기 때문에)
    stage++;
    if (player.state) {
      stage = 1;
      player.initialize();
      monster.initialize();
    }
  }
  if (stage === 11) {
    console.log('★ ★ ★ 게임을 클리어하셨습니다! 축하드립니다 ★ ★ ★');
  }
}
