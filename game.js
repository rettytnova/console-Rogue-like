import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
  constructor() {
    this._hp = 100; // 체력
    this._atk = 10; // 공격력
    this._def = 1; // 방어력
    this._acc = 5; // 명중률
    this._avd = 0; // 회피율 // 명중률 대비 회피율이 10 이상이면 일반 공격 무효화 if(avd >= acc + 10){ dmg = 0; }
    this._spd = 5; // 속도 (속도가 낮으면 후공으로 시작 / 같으면 플레이어 선공)
    this._runningState = false; // false는 stand상태, true는 running 상태
  }
  getStatusString() {
    return `HP: ${this._hp} ATK: ${this._atk} DEF: ${this._def} ACC: ${this._acc} AVD: ${this._avd} SPD: ${this._spd}`;
  }
  getSpeed() {
    return this._spd;
  }
  getState() {
    return this._runningState;
  }
  attack() {
    return [this._atk, this._acc]; // 공격력과 명중률을 리턴해준다
  }
  damaged(mAtk, mAcc) {
    let dmg = 0;
    if (this._avd < mAcc + 10) {
      // 명중률과 회피율을 비교해 회피가 불가능하면 데미지 누적
      dmg = mAtk - this._def;
    }
    this._hp -= dmg;
  }
  buff(upHp, upAtk, upDef, upAcc, upAvd, upSpd) {
    // 실제 버프는 아니고, 스텟 상승효과 발동시 효과 적용
    this._hp += upHp;
    this._atk += upAtk;
    this._def += upDef;
    this._acc += upAcc;
    this._avd += upAvd;
    this._spd += upSpd;
  }
  changeState() {
    if (this.runningState) {
      this.runningState = false;
    } else {
      this.runningState = true;
    }
  }
}

class Monster {
  constructor(hp, atk, def, acc, avd, spd) {
    this._hp = hp;
    this._atk = atk;
    this._def = def;
    this._acc = acc;
    this._avd = avd;
    this._spd = spd;
  }
  getStatusString() {
    return `HP: ${this._hp} ATK: ${this._atk} DEF: ${this._def} ACC: ${this._acc} AVD: ${this._avd} SPD: ${this._spd}`;
  }
  getSpeed() {
    return this._spd;
  }
  attack() {
    return [this._atk, this.acc];
  }
  damaged(pAtk, pAcc) {
    let dmg = 0;
    if (this._avd < pAcc + 10) {
      dmg = pAtk - this._def;
    }
    this._hp -= dmg;
    return dmg;
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} |`) +
      chalk.blueBright(`\n| ${player.getStatusString()} |`) +
      chalk.redBright(`\n| ${monster.getStatusString()} |`),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];
  let dmg = 0;
  let firstAttack = 'player';
  while (player.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    if (firstAttck === 'player' && player.getSpeed() < monster.getSpeed()) {
      //플레이어와 몬스터의 속도를 비교해서 몬스터가 선공권을 가져갈 경우 피격되고 시작함
      firstAttack = 'monster';
      console.log(chalk.yellow('몬스터가 선공권을 갖습니다.'));
      dmg = player.damaged(monster.attack());
      console.log(chalk.red(`플레이어가 ${dmg}의 피해를 입었습니다.`));
    }

    console.log(chalk.green(`\n1. 공격한다  2. 도망간다.  3. 게임종료`));

    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
    switch (choice) {
      case '1':
        console.log(chalk.yellow('공격하기'));
        dmg = monster.damaged(player.attack());
        console.log(chalk.red(`몬스터가 ${dmg}의 피해를 입었습니다.`));
        break;
      case '2':
        console.log(chalk.yellow('도망쳐 !'));
        player.changeState(); //스탠딩 상태 -> 도망 상태로 변경
        break;
      case '3':
        console.log(chalk.red('게임을 종료합니다.'));
        process.exit(0); // 게임 종료
        break;
      default:
        console.log(chalk.red('올바른 선택을 하세요.'));
    }
    if (player.getState()) {
      break;
    }
    if (firstAttack === 'player') {
      dmg = player.damaged(monster.attack());
      console.log(chalk.red(`플레이어가 ${dmg}의 피해를 입었습니다.`));
    }
  }
};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(
      50 + stage * 3,
      10 + stage * 3,
      1 + stage * 1,
      1 + stage * 1,
      stage * 1,
      stage * 1,
    );
    await battle(stage, player, monster);
    // 스테이지 클리어 및 게임 종료 조건
    if (player.hp <= 0) {
      console.log(chalk.red('플레이어가 사망하였습니다.'));
      process.exit(0); // 게임 종료
    } else if (monster.hp <= 0) {
      console.log(chalk.red('몬스터를 쓰러트렸습니다!'));
      player.buff(20, 5, 1, 1, 1, 1);
    }
    if (!player.getState()) {
      // 도망가지 않았다면 클리어한 것 이므로 stage 올림
      stage++;
    } else {
      player.changeState(); // 도망갔다면 스테이지 단계 유지 및 도망상태를 스탠딩상태로 전환
    }
  }
}
